const inputClasses =
  "block w-full max-w-full px-4 py-3.5 border-2 border-border rounded-lg text-base bg-white focus:outline-none focus:border-swedenblue transition-colors";

const TEXT_FIELDS = [
  {
    name: "name",
    type: "text",
    placeholder: "Your Full Name *",
    autoComplete: "name",
  },
  {
    name: "email",
    type: "email",
    placeholder: "Your Email Address *",
    autoComplete: "email",
  },
  {
    name: "phone",
    type: "tel",
    placeholder: "Your Phone Number *",
    autoComplete: "tel",
  },
  {
    name: "nationality",
    type: "text",
    placeholder: "Your Nationality *",
    autoComplete: "country-name",
  },
] as const;

const SERVICES = [
  "Germany Work Permit",
  "UK Work Permit",
  "Canada Tourist Visa",
  "Schengen Visit Visa",
  "Lithuania Work Permit",
  "Ukraine Business Invitation",
  "Company Formation",
  "Other (please specify in message)",
];

export default function ContactForm() {
  return (
    <form
      action="https://formsubmit.co/manartanveer@gmail.com"
      method="POST"
      className="w-full min-w-0"
    >
      <input type="hidden" name="_subject" value="New contact enquiry" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="text" name="_honey" className="hidden" tabIndex={-1} />

      {TEXT_FIELDS.map((field) => (
        <div key={field.name} className="mb-4">
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            required
            className={inputClasses}
          />
        </div>
      ))}

      <div className="mb-4">
        <select
          name="service"
          required
          defaultValue=""
          className={inputClasses}
        >
          <option value="" disabled>
            Select Service Interested In *
          </option>
          {SERVICES.map((service) => (
            <option key={service}>{service}</option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <textarea
          name="message"
          placeholder="Tell us about your needs... *"
          required
          className={`${inputClasses} min-h-[130px] resize-y`}
        />
      </div>

      <button
        type="submit"
        className="w-full text-center px-9 py-3.5 rounded-full font-semibold bg-swedenyellow text-ink hover:bg-swedenyellowDark hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)] transition-all"
      >
        Send Message
      </button>
    </form>
  );
}
