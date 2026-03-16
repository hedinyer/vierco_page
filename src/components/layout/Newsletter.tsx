"use client";

export default function Newsletter() {
  return (
    <footer className="relative mt-10 mb-8">
      <div className="max-w-7xl sm:px-6 lg:px-8 mr-auto ml-auto pr-4 pl-4">
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-linear-to-b from-white/10 via-white/5 to-transparent" />
          </div>
          <div className="relative sm:p-8 pt-6 pr-6 pb-6 pl-6">
            <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
              {/* Company Info */}
              <div className="lg:col-span-1">
                <a
                  href="#"
                  aria-label="Vierco"
                  className="inline-flex items-center justify-center h-[40px] w-[120px] bg-center bg-[url(https://hoirqrkdgbmvpwutwuwj-all.supabase.co/storage/v1/object/public/assets/assets/37623fdd-ceb4-464d-a301-ff8b1166efc4_800w.jpg)] bg-cover rounded mix-blend-multiply invert"
                />
                <p className="mt-4 text-sm text-black/70 font-body">
                  Professional cleaning services for homes and offices. Trusted by thousands of customers.
                </p>
                <div className="mt-6 flex gap-4">
                  <a
                    href="#"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-gray-100 text-black/60 hover:text-black border-white/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-gray-100 text-black/60 hover:text-black border-white/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                      <path d="M4 20l6.768-6.768m2.46-2.46l6.772-6.772" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border bg-gray-100 text-black/60 hover:text-black border-white/20"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-sm font-semibold text-black tracking-tight font-body">Services</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Residential Cleaning
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Office Cleaning
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Deep Cleaning
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Move-in/Move-out
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Post-Construction
                    </a>
                  </li>
                </ul>
              </div>

              {/* Company */}
              <div>
                <h3 className="text-sm font-semibold text-black tracking-tight font-body">Company</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Careers
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Service Areas
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Reviews
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-black/70 hover:text-black font-body">
                      Blog
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-semibold text-black tracking-tight font-body">Contact</h3>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-black/60"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="text-sm text-black/70 font-body">(555) 123-4567</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-black/60"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-10 5L2 7" />
                    </svg>
                    <span className="text-sm text-black/70 font-body">hello@lala.com</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 text-black/60 mt-0.5"
                    >
                      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <span className="text-sm text-black/70 font-body">
                      123 Main Street, San Francisco, CA 94102
                    </span>
                  </li>
                </ul>
                <div className="mt-6">
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium bg-black text-neutral-100 hover:bg-black/90 font-body"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M8 2v4" />
                      <path d="M16 2v4" />
                      <rect width="18" height="18" x="3" y="4" rx="2" />
                      <path d="M3 10h18" />
                    </svg>
                    Book now
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="mt-8 pt-6 border-t border-black/10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-black/60 font-body">
                  © 2024 Lala Cleaning Services. All rights reserved.
                </p>
                <div className="flex flex-wrap gap-6">
                  <a href="#" className="text-sm text-black/60 hover:text-black font-body">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-sm text-black/60 hover:text-black font-body">
                    Terms of Service
                  </a>
                  <a href="#" className="text-sm text-black/60 hover:text-black font-body">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
