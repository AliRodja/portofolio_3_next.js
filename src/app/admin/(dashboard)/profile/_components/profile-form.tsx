"use client";

import { startTransition, useActionState } from "react";
import type { ProfileData } from "@/db/schema";
import {
  Field,
  FormSection,
  SaveBar,
  inputClass,
  type FormState,
} from "../../_components/form";
import { MediaField } from "../../_components/media-field";
import { saveProfile } from "../actions";
import { SocialsField } from "./socials-field";

const photoValue = (url: string | null) => (url ? [url] : []);

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    saveProfile,
    {},
  );
  const errors = state.errors ?? {};

  return (
    <form
      // Submitting through onSubmit instead of the action prop keeps React
      // from resetting the fields after each save.
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="space-y-8"
    >
      <FormSection
        title="Basic info"
        description="How you are introduced across the site."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            label="Display name"
            hint="Short name for the navbar and footer."
            error={errors.name}
          >
            <input
              name="name"
              defaultValue={profile.name}
              className={inputClass}
              required
            />
          </Field>
          <Field label="Full name" error={errors.fullName}>
            <input
              name="fullName"
              defaultValue={profile.fullName}
              className={inputClass}
              required
            />
          </Field>
          <Field
            label="Role"
            hint="The big headline on the home page."
            error={errors.role}
          >
            <input
              name="role"
              defaultValue={profile.role}
              placeholder="Software Engineer"
              className={inputClass}
              required
            />
          </Field>
          <Field
            label="Email"
            hint="Shown in the contact section."
            error={errors.email}
          >
            <input
              name="email"
              type="email"
              defaultValue={profile.email}
              className={inputClass}
              required
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="About you" description="Text on the home and about pages.">
        <Field
          label="Intro"
          hint="A sentence or two under the headline on the home page."
          error={errors.intro}
        >
          <textarea
            name="intro"
            defaultValue={profile.intro}
            rows={3}
            className={inputClass}
            required
          />
        </Field>
        <Field
          label="About"
          hint={
            <>
              Shown in &quot;Who Am I?&quot; on the about page. Separate paragraphs
              with a blank line, and wrap words in{" "}
              <code className="rounded bg-gray-100 px-1">**double asterisks**</code>{" "}
              to make them bold.
            </>
          }
          error={errors.about}
        >
          <textarea
            name="about"
            defaultValue={profile.about.join("\n\n")}
            rows={8}
            className={inputClass}
            required
          />
        </Field>
        <Field
          label="Search description"
          hint="Shown by Google and in link previews. Up to 300 characters."
          error={errors.description}
        >
          <textarea
            name="description"
            defaultValue={profile.description}
            rows={2}
            maxLength={300}
            className={inputClass}
            required
          />
        </Field>
      </FormSection>

      <FormSection
        title="Photos"
        description="Shown in black and white, in color on hover. Empty slots show a placeholder."
      >
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 xl:grid-cols-4">
          <MediaField
            name="heroPhoto"
            aspect="portrait"
            label="Home"
            hint="Portrait next to your name."
            alignHint
            folder="profile"
            defaultValue={photoValue(profile.heroPhoto)}
          />
          <MediaField
            name="aboutPhoto"
            aspect="portrait"
            label="About section"
            hint="Home section and about page header."
            alignHint
            folder="profile"
            defaultValue={photoValue(profile.aboutPhoto)}
          />
          <MediaField
            name="projectsPhoto"
            aspect="portrait"
            label="Projects section"
            hint="Home section and projects page header."
            alignHint
            folder="profile"
            defaultValue={photoValue(profile.projectsPhoto)}
          />
          <MediaField
            name="contactPhoto"
            aspect="portrait"
            label="Contact section"
            hint="Beside the contact details on the home page."
            alignHint
            folder="profile"
            defaultValue={photoValue(profile.contactPhoto)}
          />
        </div>
        <MediaField
          name="collagePhotos"
          aspect="square"
          label="About collage"
          hint="Up to three photos beside “Who Am I?” on the about page."
          folder="profile"
          max={3}
          defaultValue={profile.collagePhotos}
        />
      </FormSection>

      <FormSection
        title="Social links"
        description="Icons in the contact section, after your email."
      >
        <SocialsField defaultValue={profile.socials} error={errors.socials} />
      </FormSection>

      <FormSection
        title="Quote"
        description="Closes the about page. Leave both lines empty to hide it."
      >
        <Field label="First line" hint="Shown large." error={errors.quoteLine1}>
          <input
            name="quoteLine1"
            defaultValue={profile.quoteLine1}
            className={inputClass}
          />
        </Field>
        <Field label="Second line" hint="Shown smaller below." error={errors.quoteLine2}>
          <input
            name="quoteLine2"
            defaultValue={profile.quoteLine2}
            className={inputClass}
          />
        </Field>
      </FormSection>

      <FormSection
        title="CV"
        description="Adds a “Download CV” button to the home page."
      >
        <MediaField
          name="cvUrl"
          label="CV file (PDF)"
          folder="profile"
          kind="file"
          defaultValue={photoValue(profile.cvUrl)}
        />
      </FormSection>

      <SaveBar state={state} isPending={isPending} />
    </form>
  );
}
