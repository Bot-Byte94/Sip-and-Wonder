declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    INVITE_REQUIRED?: string;
    SIGNUP_INVITE?: string;
    BUCKET?: R2Bucket;
  }
}
