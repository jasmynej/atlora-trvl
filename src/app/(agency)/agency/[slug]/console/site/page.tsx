import Button from "@/components/base/Button";
import Link from "next/link";
export default function AgencySite(){
    return (
        <div>
            <Button color="primary" size="lg">Primary</Button>
            <Button color="accent_1" size="lg">Accent 1</Button>
            <Button color="accent_2" size="lg">Accent 2</Button>
            <Button color="accent_3" size="lg">Accent 3</Button>
            <h1 className="font-heading text-3xl font-bold">Heading Font</h1>
            <p className="font-body">Body Text</p>

            <Link href="../console/site/theme">Edit theme</Link>
        </div>
    )
}