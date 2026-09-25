// Test-only defaults. DATABASE_URL here must point at a disposable local test database,
// never at a real/shared/production one. Override with a real env var to use a different
// local test DB; this file never touches anything outside localhost by design.
process.env.DATABASE_URL ||= "postgresql://dentalpro_test:dentalpro_test_pw@localhost:5432/dentalpro_test";
process.env.NEXTAUTH_SECRET ||= "test-only-secret-not-used-in-production";
