import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const contactEmail = "globex@example.com";
const contactPhone = "+91 1234567890";

export default function Contact() {

  const emptyFormData = { name: "", email: "", subject: "", message: "" };
  const [formData, setFormData] = useState(emptyFormData);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((currentFormData) => ({ ...currentFormData, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(formData);
    setFormData(emptyFormData);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-[#f9faff] px-4 py-12 text-[#272727] sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#646464]">We're here to help</p>
            <h1 className="mt-3 text-3xl font-bold text-[#00071b] sm:text-4xl lg:text-5xl">Contact us</h1>
            <p className="mt-4 text-sm leading-7 text-[#646464] sm:text-base">
              Have a question about an order, a product, or anything else? Send us a message and we'll be happy to help.
            </p>
          </header>

          <div className="mt-10 grid overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-[0_12px_40px_rgba(0,7,27,0.06)] md:mt-14 md:grid-cols-[0.8fr_1.2fr]">
            <aside className="bg-[#00071b] p-6 text-white sm:p-9 lg:p-12">
              <h2 className="text-xl font-bold sm:text-2xl">Get in touch</h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Reach out using the details below, or send us a message with the form.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Email</h3>
                  <a href="" className="mt-2 inline-block text-sm transition-opacity hover:opacity-70">
                    {contactEmail}
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Phone</h3>
                  <a href="" className="mt-2 inline-block text-sm transition-opacity hover:opacity-70">
                    {contactPhone}
                  </a>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white/60">Support hours</h3>
                  <p className="mt-2 text-sm">Monday - Saturday, 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </aside>

            <form onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-9 lg:p-12">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-sm font-semibold">Your name</label>
                  <input id="contact-name" name="name" type="text" autoComplete="name" required
                    value={formData.name} onChange={handleChange}
                    className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-sm font-semibold">Email address</label>
                  <input id="contact-email" name="email" type="email" autoComplete="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10" />
                </div>
              </div>
              <div>
                <label htmlFor="contact-subject" className="mb-2 block text-sm font-semibold">Subject</label>
                <input id="contact-subject" name="subject" type="text" required
                  value={formData.subject} onChange={handleChange}
                  className="w-full rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10" />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-sm font-semibold">Message</label>
                <textarea id="contact-message" name="message" rows="4" required
                  value={formData.message} onChange={handleChange}
                  className="w-full resize-y rounded-lg border border-[#dedede] px-3.5 py-3 text-sm outline-none transition focus:border-[#00071b] focus:ring-2 focus:ring-[#00071b]/10" />
              </div>
              <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#00071b] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#17213a] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#00071b] sm:w-auto">
                Send message
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}