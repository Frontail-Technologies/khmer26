import { redirect } from "next/navigation"

export default function LegacyFieldsRedirect() {
  redirect("/admin/listing-fields")
}
