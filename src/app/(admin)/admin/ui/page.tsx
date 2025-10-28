"use client"
import Button from "@/components/base/Button";
import Section from "@/components/base/Section";


export default function AdminUiComponentView() {
    return (
        <div className="p-5">
            <h1 className="text-2xl">Testing UI components</h1>
            <div className="flex gap-5">
                <Button color="primary">Primary</Button>
                <Button color="accent_1">Accent 1</Button>
                <Button color="accent_2">Accent 2</Button>
                <Button color="accent_3">Accent 3</Button>
            </div>
            <div>

            </div>
            <div className="w-1/2">
                <Section variant="hero" bkImage="/images/africa-hero.jpg" overlay>
                    <h1 className="text-5xl font-bold">Explore Africa</h1>
                </Section>
            </div>


            <Section variant="med" bkColor="bg-brand-accent-1">
                <p>Travel stories and insights await.</p>
            </Section>
        </div>

    )
}