import { z } from "zod";

export const JdFormSchema = z.object({
  jobTitle:     z.string().optional(),
  company:      z.string().optional(),
  requirements: z.string().min(1, "Requirements are required"),
  description:  z.string().optional(),
  workingHours: z.string().optional(),
  benefits:     z.string().optional(),
  otherInfo:    z.string().optional(),
});

export type JdForm = z.infer<typeof JdFormSchema>;

export const EMPTY_JD_FORM: JdForm = {
  jobTitle:     "",
  company:      "",
  requirements: "",
  description:  "",
  workingHours: "",
  benefits:     "",
  otherInfo:    "",
};
