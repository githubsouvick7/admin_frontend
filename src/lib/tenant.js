// /lib/tenant.ts

/**
 * Extract tenant name from the hostname
 * e.g. demo.example.com → demo
 */
export function getTenantFromHost(host) {
  if (!host) return null;

  // Remove port if present
  const cleanHost = host.split(":")[0];

  // Split host parts
  const parts = cleanHost.split(".");

  // Assuming main domain is example.com → tenant.example.com
  if (parts.length < 3) return null;

  return parts[0]; // first part is tenant
}
