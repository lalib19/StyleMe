export { default } from "next-auth/middleware"

export const config = { matcher: ["/profile"] }

// If you only want to secure certain pages, export a config
// object with a matcher
// Now you will still be able to visit every page,
// but only /profile will require authentication.
// If a user is not logged in, the default behavior is to
// redirect them to the sign-in page.