#!/usr/bin/env node
// @ts-nocheck

import { existsSync, readFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { resolve } from 'node:path';

const ENV_FILES = ['.env.local', '.env'];
const INFERENCE_PROVIDERS = new Set(['babysea', 'bfl']);
const STORAGE_PROVIDERS = new Set([
  'supabase-storage',
  'vercel-blob',
  'cloudflare-r2',
  'aws-s3',
]);

const env = loadEnv();
const checks = [];

checkUrl('NEXT_PUBLIC_SITE_URL', { allowLocalhost: true });
checkEmail('OWNER_EMAIL');
checkUrl('NEXT_PUBLIC_SUPABASE_URL', { allowLocalhost: true });
checkRequired('NEXT_PUBLIC_SUPABASE_PUBLIC_KEY');
checkRequired('SUPABASE_SECRET_KEY');

const preferredInference = optional('INFERENCE_PROVIDER')?.toLowerCase();
const hasBabySea = Boolean(optional('BABYSEA_API_KEY'));
const hasBfl = Boolean(optional('BFL_API_KEY'));

if (preferredInference && !INFERENCE_PROVIDERS.has(preferredInference)) {
  fail('INFERENCE_PROVIDER must be babysea or bfl.');
} else if (preferredInference === 'babysea' && !hasBabySea) {
  fail('INFERENCE_PROVIDER=babysea requires BABYSEA_API_KEY.');
} else if (preferredInference === 'bfl' && !hasBfl) {
  fail('INFERENCE_PROVIDER=bfl requires BFL_API_KEY.');
} else if (!hasBabySea && !hasBfl) {
  fail('Set BABYSEA_API_KEY or BFL_API_KEY.');
} else {
  pass(`Inference: ${preferredInference ?? (hasBfl ? 'bfl' : 'babysea')}`);
}

const preferredStorage = optional('STORAGE_PROVIDER')?.toLowerCase();
const storageRequirements = {
  'cloudflare-r2': [
    'CLOUDFLARE_R2_ACCOUNT_ID',
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_ENDPOINT_URL',
    'CLOUDFLARE_R2_CUSTOM_DOMAIN_URL',
  ],
  'aws-s3': [
    'AWS_S3_REGION',
    'AWS_S3_ACCESS_KEY_ID',
    'AWS_S3_SECRET_ACCESS_KEY',
    'AWS_S3_BUCKET_NAME',
    'AWS_S3_ENDPOINT_URL',
  ],
};
const storageAvailability = {
  'vercel-blob': Boolean(optional('BLOB_READ_WRITE_TOKEN')),
  'cloudflare-r2': hasAll(storageRequirements['cloudflare-r2']),
  'aws-s3': hasAll(storageRequirements['aws-s3']),
  'supabase-storage': true,
};

if (preferredStorage && !STORAGE_PROVIDERS.has(preferredStorage)) {
  fail(
    'STORAGE_PROVIDER must be supabase-storage, vercel-blob, cloudflare-r2, or aws-s3.',
  );
} else if (preferredStorage && !storageAvailability[preferredStorage]) {
  fail(`STORAGE_PROVIDER=${preferredStorage} is missing required env values.`);
} else {
  pass(`Storage: ${preferredStorage ?? detectStorageProvider()}`);
}

if (hasAny(storageRequirements['cloudflare-r2'])) {
  checkRequiredGroup('cloudflare-r2', storageRequirements['cloudflare-r2']);
}

if (hasAny(storageRequirements['aws-s3'])) {
  checkRequiredGroup('aws-s3', storageRequirements['aws-s3']);
}

if (optional('CLOUDFLARE_R2_ENDPOINT_URL')) {
  checkUrl('CLOUDFLARE_R2_ENDPOINT_URL');
  checkR2EndpointHost('CLOUDFLARE_R2_ENDPOINT_URL');
  checkR2EndpointBucketPath('CLOUDFLARE_R2_ENDPOINT_URL');
}

if (optional('CLOUDFLARE_R2_CUSTOM_DOMAIN_URL')) {
  checkUrl('CLOUDFLARE_R2_CUSTOM_DOMAIN_URL');
  checkNoUrlCredentials('CLOUDFLARE_R2_CUSTOM_DOMAIN_URL');
  checkR2PublicReadHost('CLOUDFLARE_R2_CUSTOM_DOMAIN_URL');
}

if (optional('AWS_S3_ENDPOINT_URL')) {
  checkUrl('AWS_S3_ENDPOINT_URL');
  checkAwsS3EndpointUrl('AWS_S3_ENDPOINT_URL');
}

if (
  preferredStorage === 'vercel-blob' ||
  (!preferredStorage && storageAvailability['vercel-blob'])
) {
  pass('vercel-blob storage selected; use Vercel for hosting.');
}

checkOptionalPositiveInteger('CUSTOM_USER_STORAGE_QUOTA_GB');

if (optional('STORAGE_SMOKE_TEST')) {
  await probeStorage();
}

for (const check of checks) {
  console.log(`${check.ok ? 'OK' : 'ERROR'} ${check.message}`);
}

if (checks.some((check) => !check.ok)) {
  process.exitCode = 1;
}

function loadEnv() {
  const loaded = { ...process.env };

  for (const file of ENV_FILES) {
    const path = resolve(process.cwd(), file);

    if (!existsSync(path)) {
      continue;
    }

    const content = readFileSync(path, 'utf8');

    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      const separator = trimmed.indexOf('=');

      if (separator === -1) {
        continue;
      }

      const name = trimmed.slice(0, separator).trim();

      if (!name || loaded[name]) {
        continue;
      }

      loaded[name] = unquote(trimmed.slice(separator + 1).trim());
    }
  }

  return loaded;
}

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function optional(name) {
  const value = env[name]?.trim();

  return value ? value : undefined;
}

function checkRequired(name) {
  if (optional(name)) {
    pass(`${name} is set.`);
  } else {
    fail(`${name} is missing.`);
  }
}

function checkUrl(name, options = {}) {
  const value = optional(name);

  if (!value) {
    fail(`${name} is missing.`);
    return;
  }

  try {
    const url = new URL(value);
    const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(
      url.hostname.toLowerCase(),
    );

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      fail(`${name} must use HTTP or HTTPS.`);
      return;
    }

    if (url.protocol !== 'https:' && !(options.allowLocalhost && isLocalhost)) {
      fail(`${name} must use HTTPS outside local development.`);
      return;
    }

    pass(`${name} is valid.`);
  } catch {
    fail(`${name} must be a valid URL.`);
  }
}

function checkR2EndpointBucketPath(name) {
  const value = optional(name);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    const endpointBucket = bucketFromEndpointPath(url.pathname);
    const bucket = optional('CLOUDFLARE_R2_BUCKET_NAME');

    if (!endpointBucket) {
      pass(`${name} bucket path is empty; using CLOUDFLARE_R2_BUCKET_NAME.`);
      return;
    }

    if (!bucket) {
      fail(
        `${name} includes a bucket path, but CLOUDFLARE_R2_BUCKET_NAME is missing.`,
      );
      return;
    }

    if (endpointBucket !== bucket) {
      fail(
        `${name} bucket path (${endpointBucket}) must match CLOUDFLARE_R2_BUCKET_NAME (${bucket}).`,
      );
      return;
    }

    pass(`${name} bucket path matches CLOUDFLARE_R2_BUCKET_NAME.`);
  } catch (error) {
    if (error instanceof Error) {
      fail(error.message);
    }
  }
}

function checkR2EndpointHost(name) {
  const value = optional(name);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    const accountId = optional('CLOUDFLARE_R2_ACCOUNT_ID');

    if (!accountId) {
      fail(`${name} requires CLOUDFLARE_R2_ACCOUNT_ID to validate host.`);
      return;
    }

    if (url.username || url.password) {
      fail(`${name} must not include credentials.`);
      return;
    }

    const hostname = url.hostname.toLowerCase();
    const normalizedAccountId = accountId.toLowerCase();
    const isCloudflareR2Host =
      hostname.startsWith(`${normalizedAccountId}.`) &&
      hostname.endsWith('.r2.cloudflarestorage.com');

    if (!isCloudflareR2Host) {
      fail(
        `${name} must be the Cloudflare R2 S3 API endpoint for CLOUDFLARE_R2_ACCOUNT_ID, not an R2 public or custom domain.`,
      );
      return;
    }

    pass(`${name} host matches CLOUDFLARE_R2_ACCOUNT_ID.`);
  } catch (error) {
    if (error instanceof Error) {
      fail(error.message);
    }
  }
}

function checkR2PublicReadHost(name) {
  const value = optional(name);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();

    if (hostname.endsWith('.r2.cloudflarestorage.com')) {
      fail(
        `${name} must be an R2 Public Development URL or custom domain, not the Cloudflare R2 S3 API endpoint.`,
      );
      return;
    }

    pass(`${name} is a public-read host.`);
  } catch (error) {
    if (error instanceof Error) {
      fail(error.message);
    }
  }
}

function checkNoUrlCredentials(name) {
  const value = optional(name);

  if (!value) {
    return;
  }

  try {
    const url = new URL(value);

    if (url.username || url.password) {
      fail(`${name} must not include credentials.`);
      return;
    }

    pass(`${name} does not include credentials.`);
  } catch (error) {
    if (error instanceof Error) {
      fail(error.message);
    }
  }
}

function bucketFromEndpointPath(pathname) {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');

  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('/')) {
    throw new Error(
      'CLOUDFLARE_R2_ENDPOINT_URL can include only the bucket path at the end.',
    );
  }

  return decodeURIComponent(trimmed);
}

function checkEmail(name) {
  const value = optional(name);

  if (!value) {
    fail(`${name} is missing.`);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    fail(`${name} must be a valid email address.`);
    return;
  }

  pass(`${name} is valid.`);
}

function checkOptionalPositiveInteger(name) {
  const value = optional(name);

  if (!value) {
    return;
  }

  if (!/^[1-9][0-9]*$/.test(value)) {
    fail(`${name} must be a positive integer.`);
    return;
  }

  pass(`${name} is a positive integer.`);
}

function hasAll(names) {
  return names.every((name) => Boolean(optional(name)));
}

function hasAny(names) {
  return names.some((name) => Boolean(optional(name)));
}

function checkRequiredGroup(provider, names) {
  const missing = names.filter((name) => !optional(name));

  if (missing.length > 0) {
    fail(`${provider} requires ${missing.join(', ')}.`);
  }
}

function detectStorageProvider() {
  if (storageAvailability['vercel-blob']) return 'vercel-blob';
  if (storageAvailability['cloudflare-r2']) return 'cloudflare-r2';
  if (storageAvailability['aws-s3']) return 'aws-s3';
  return 'supabase-storage';
}

function pass(message) {
  checks.push({ ok: true, message });
}

function fail(message) {
  checks.push({ ok: false, message });
}

async function probeStorage() {
  const provider = preferredStorage ?? detectStorageProvider();
  const key = `sherin-doctor/${Date.now()}-${randomUUID()}.txt`;
  const payload = new TextEncoder().encode('sherin storage smoke test');

  if (provider === 'supabase-storage') {
    await probeSupabaseStorage(key, payload, 'Supabase Storage');
    return;
  }

  if (provider === 'vercel-blob') {
    await probeVercelBlobStorage(key, payload);
  } else if (provider === 'cloudflare-r2') {
    await probeS3CompatibleStorage(
      {
        accessKeyId: optional('CLOUDFLARE_R2_ACCESS_KEY_ID'),
        bucket: optional('CLOUDFLARE_R2_BUCKET_NAME'),
        endpoint: cloudflareR2S3Endpoint(),
        forcePathStyle: true,
        label: 'Cloudflare R2',
        publicBaseUrl: optional('CLOUDFLARE_R2_CUSTOM_DOMAIN_URL'),
        region: 'auto',
        secretAccessKey: optional('CLOUDFLARE_R2_SECRET_ACCESS_KEY'),
      },
      key,
      payload,
    );
  } else if (provider === 'aws-s3') {
    const endpointConfig = awsS3EndpointConfig();
    await probeS3CompatibleStorage(
      {
        accessKeyId: optional('AWS_S3_ACCESS_KEY_ID'),
        bucket: optional('AWS_S3_BUCKET_NAME'),
        endpoint: endpointConfig?.clientEndpoint,
        forcePathStyle: false,
        label: 'AWS S3',
        publicBaseUrl: endpointConfig?.publicBaseUrl,
        region: optional('AWS_S3_REGION'),
        secretAccessKey: optional('AWS_S3_SECRET_ACCESS_KEY'),
      },
      key,
      payload,
    );
  }

  await probeSupabaseStorage(
    `${key}.fallback`,
    payload,
    'Supabase Storage fallback',
  );
}

async function probeSupabaseStorage(key, payload, label) {
  const supabaseUrl = optional('NEXT_PUBLIC_SUPABASE_URL');
  const serviceKey = optional('SUPABASE_SECRET_KEY');
  const bucket = optional('SUPABASE_STORAGE_BUCKET') ?? 'sherin-generations';
  let uploaded = false;

  if (!supabaseUrl || !serviceKey) {
    fail(
      `${label} smoke test requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.`,
    );
    return;
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });
    const storage = supabase.storage.from(bucket);
    const { error: uploadError } = await storage.upload(key, payload, {
      contentType: 'text/plain; charset=utf-8',
      upsert: true,
    });

    if (uploadError) throw uploadError;

    uploaded = true;

    const { data: downloaded, error: downloadError } =
      await storage.download(key);

    if (downloadError) throw downloadError;

    await assertDownloadedPayload(`${label} smoke test`, downloaded, payload);

    const { error: removeError } = await storage.remove([key]);

    if (removeError) throw removeError;

    uploaded = false;

    pass(`${label} Put/Get/Delete smoke test passed for bucket '${bucket}'.`);
  } catch (error) {
    fail(`${label} smoke test failed: ${errorMessage(error)}`);

    if (uploaded) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(supabaseUrl, serviceKey, {
          auth: { persistSession: false },
        });
        await supabase.storage.from(bucket).remove([key]);
      } catch {
        // Best effort cleanup only.
      }
    }
  }
}

async function probeVercelBlobStorage(key, payload) {
  const token = optional('BLOB_READ_WRITE_TOKEN');

  if (!token) {
    fail('Vercel Blob smoke test requires BLOB_READ_WRITE_TOKEN.');
    return;
  }

  let uploadedUrl = null;

  try {
    const blob = await import('@vercel/blob');
    const result = await blob.put(key, payload, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'text/plain; charset=utf-8',
      token,
    });
    uploadedUrl = result.url;

    const response = await fetch(uploadedUrl, {
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new Error(`download returned HTTP ${response.status}`);
    }

    await assertDownloadedPayload(
      'Vercel Blob smoke test',
      await response.blob(),
      payload,
    );

    await blob.del(uploadedUrl, { token });
    uploadedUrl = null;
    pass('Vercel Blob Put/Get/Delete smoke test passed.');
  } catch (error) {
    fail(`Vercel Blob smoke test failed: ${errorMessage(error)}`);

    if (uploadedUrl) {
      try {
        const blob = await import('@vercel/blob');
        await blob.del(uploadedUrl, { token });
      } catch {
        // Best effort cleanup only.
      }
    }
  }
}

async function probeS3CompatibleStorage(config, key, payload) {
  if (
    !config.region ||
    !config.endpoint ||
    !config.accessKeyId ||
    !config.secretAccessKey ||
    !config.bucket
  ) {
    fail(`${config.label} smoke test is missing required storage env values.`);
    return;
  }

  let client;
  let commands;

  try {
    commands = await import('@aws-sdk/client-s3');
    client = new commands.S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: config.forcePathStyle,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  } catch (error) {
    fail(
      `${config.label} smoke test could not load @aws-sdk/client-s3: ${errorMessage(error)}`,
    );
    return;
  }

  try {
    await client.send(
      new commands.PutObjectCommand({
        Body: payload,
        Bucket: config.bucket,
        ContentType: 'text/plain; charset=utf-8',
        Key: key,
      }),
    );

    const object = await client.send(
      new commands.GetObjectCommand({ Bucket: config.bucket, Key: key }),
    );

    await assertDownloadedPayload(
      `${config.label} smoke test`,
      object.Body,
      payload,
    );

    if (config.publicBaseUrl) {
      await assertPublicObjectPayload(config, key, payload);
    }

    await client.send(
      new commands.DeleteObjectCommand({ Bucket: config.bucket, Key: key }),
    );

    const checks = config.publicBaseUrl
      ? 'Put/Get/Public read/Delete'
      : 'Put/Get/Delete';

    pass(
      `${config.label} ${checks} smoke test passed for bucket '${config.bucket}'.`,
    );
  } catch (error) {
    fail(`${config.label} smoke test failed: ${errorMessage(error)}`);

    try {
      await client.send(
        new commands.DeleteObjectCommand({ Bucket: config.bucket, Key: key }),
      );
    } catch {
      // Best effort cleanup only.
    }
  }
}

async function assertPublicObjectPayload(config, key, payload) {
  const publicUrl = buildPublicObjectUrl(config.publicBaseUrl, key);
  const response = await fetch(publicUrl, {
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(
      `${config.label} public read returned HTTP ${response.status}.`,
    );
  }

  await assertDownloadedPayload(
    `${config.label} public-read smoke test`,
    await response.blob(),
    payload,
  );
}

function buildPublicObjectUrl(baseUrl, key) {
  const base = baseUrl.replace(/\/+$/, '');
  const safeKey = key
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/');

  return `${base}/${safeKey}`;
}

function cloudflareR2S3Endpoint() {
  const endpoint = optional('CLOUDFLARE_R2_ENDPOINT_URL');

  if (!endpoint) {
    return undefined;
  }

  try {
    const url = new URL(endpoint);
    url.pathname = '';
    url.search = '';
    url.hash = '';
    return url.toString().replace(/\/+$/, '');
  } catch {
    return endpoint;
  }
}

function awsS3EndpointConfig() {
  const endpointUrl = optional('AWS_S3_ENDPOINT_URL');
  const bucket = optional('AWS_S3_BUCKET_NAME');
  const region = optional('AWS_S3_REGION');

  if (!endpointUrl || !bucket || !region) {
    return undefined;
  }

  return resolveAwsS3EndpointConfig({ bucket, endpointUrl, region });
}

function checkAwsS3EndpointUrl(name) {
  const endpointUrl = optional(name);
  const bucket = optional('AWS_S3_BUCKET_NAME');
  const region = optional('AWS_S3_REGION');

  if (!endpointUrl) {
    return;
  }

  if (!bucket || !region) {
    fail(`${name} requires AWS_S3_BUCKET_NAME and AWS_S3_REGION to validate.`);
    return;
  }

  try {
    const config = resolveAwsS3EndpointConfig({ bucket, endpointUrl, region });

    pass(`${name} writes through ${config.clientEndpoint}.`);
    pass(`${name} serves public images from ${config.publicBaseUrl}.`);
  } catch (error) {
    if (error instanceof Error) {
      fail(error.message);
    }
  }
}

function resolveAwsS3EndpointConfig({ bucket, endpointUrl, region }) {
  let url;

  try {
    url = new URL(endpointUrl);
  } catch {
    throw new Error('AWS_S3_ENDPOINT_URL must be a valid URL.');
  }

  if (url.protocol !== 'https:') {
    throw new Error('AWS_S3_ENDPOINT_URL must use HTTPS.');
  }

  if (url.username || url.password) {
    throw new Error('AWS_S3_ENDPOINT_URL must not include credentials.');
  }

  url.pathname = url.pathname.replace(/\/+$/, '');
  url.search = '';
  url.hash = '';

  const hostname = url.hostname.toLowerCase();
  const bucketHostSuffix = awsS3BucketHostSuffix(hostname, bucket);

  if (bucketHostSuffix) {
    if (url.pathname && url.pathname !== '/') {
      throw new Error(
        'AWS_S3_ENDPOINT_URL bucket-host URL must not include a path.',
      );
    }

    return {
      clientEndpoint: `${url.protocol}//${bucketHostSuffix}`,
      publicBaseUrl: url.toString().replace(/\/+$/, ''),
    };
  }

  if (isAwsS3ServiceHost(hostname)) {
    const endpointBucket = bucketFromAwsEndpointPath(url.pathname);
    const clientEndpoint = `${url.protocol}//${url.host}`;

    if (endpointBucket && endpointBucket !== bucket) {
      throw new Error(
        'AWS_S3_ENDPOINT_URL bucket path must match AWS_S3_BUCKET_NAME.',
      );
    }

    return {
      clientEndpoint,
      publicBaseUrl: endpointBucket
        ? `${clientEndpoint}/${encodeURIComponent(endpointBucket)}`
        : `${url.protocol}//${bucket}.${regionalAwsS3ServiceHost(region)}`,
    };
  }

  return {
    clientEndpoint: `${url.protocol}//${regionalAwsS3ServiceHost(region)}`,
    publicBaseUrl: url.toString().replace(/\/+$/, ''),
  };
}

function awsS3BucketHostSuffix(hostname, bucket) {
  const normalizedBucket = bucket.toLowerCase();

  if (!hostname.startsWith(`${normalizedBucket}.`)) {
    return null;
  }

  const suffix = hostname.slice(normalizedBucket.length + 1);

  return isAwsS3ServiceHost(suffix) ? suffix : null;
}

function isAwsS3ServiceHost(hostname) {
  return (
    hostname === 's3.amazonaws.com' ||
    /^s3[.-][a-z0-9-]+\.amazonaws\.com$/.test(hostname)
  );
}

function regionalAwsS3ServiceHost(region) {
  return `s3.${region}.amazonaws.com`;
}

function bucketFromAwsEndpointPath(pathname) {
  const trimmed = pathname.replace(/^\/+|\/+$/g, '');

  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('/')) {
    throw new Error(
      'AWS_S3_ENDPOINT_URL can include only the bucket path, for example https://s3.us-east-1.amazonaws.com/sherin.',
    );
  }

  return decodeURIComponent(trimmed);
}

async function assertDownloadedPayload(label, body, expected) {
  const actual = await bodyToUint8Array(body);

  if (actual.byteLength !== expected.byteLength) {
    throw new Error(
      `${label} downloaded ${actual.byteLength} bytes, expected ${expected.byteLength}.`,
    );
  }

  for (let index = 0; index < expected.byteLength; index += 1) {
    if (actual[index] !== expected[index]) {
      throw new Error(`${label} downloaded payload did not match upload.`);
    }
  }
}

async function bodyToUint8Array(body) {
  if (!body) {
    throw new Error('download returned an empty body.');
  }

  if (body instanceof Uint8Array) {
    return body;
  }

  if (body instanceof Blob) {
    return new Uint8Array(await body.arrayBuffer());
  }

  if (typeof body.transformToByteArray === 'function') {
    return new Uint8Array(await body.transformToByteArray());
  }

  if (typeof body.arrayBuffer === 'function') {
    return new Uint8Array(await body.arrayBuffer());
  }

  const chunks = [];

  for await (const chunk of body) {
    chunks.push(chunk instanceof Uint8Array ? chunk : Buffer.from(chunk));
  }

  const total = chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const merged = new Uint8Array(total);
  let offset = 0;

  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }

  return merged;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
