import PricingForm from "@/components/admin/PricingForm";
import { Alert, PageHeading } from "@/components/admin/ui";
import { getAppointmentPrice } from "@/lib/queries";

export default async function AdminPricingPage() {
  const price = await getAppointmentPrice();

  return (
    <>
      <PageHeading
        title="Appointment Price"
        description="Set the consultation fee shown to visitors when booking an appointment."
      />

      {price ? (
        <PricingForm price={price} />
      ) : (
        <Alert tone="info">
          The appointment price record was not found. Start the API so it can
          create the default price, then refresh.
        </Alert>
      )}
    </>
  );
}
