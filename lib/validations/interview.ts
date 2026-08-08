import { z } from "zod";
const optionalText = z.string().trim().max(5000, "5,000文字以内で入力してください。").optional().transform((value) => value || null);
export const interviewRecordSchema = z.object({ interviewRound: z.string().trim().max(50, "面接回数は50文字以内で入力してください。").optional(), interviewDate: z.string().optional(), expectedQuestions: optionalText, preparedAnswers: optionalText, reverseQuestions: optionalText, actualQuestions: optionalText, actualAnswers: optionalText, goodPoints: optionalText, improvementPoints: optionalText, interviewerImpression: optionalText, result: z.string().trim().max(100, "選考結果は100文字以内で入力してください。").optional(), memo: optionalText });
export const companyResearchSchema = z.object({ companyFeatures: optionalText, mainBusiness: optionalText, strengths: optionalText, weaknesses: optionalText, motivation: optionalText, whatToDoAfterJoining: optionalText, reverseQuestionCandidates: optionalText, concerns: optionalText });
export type InterviewRecordInput = z.input<typeof interviewRecordSchema>;
export type CompanyResearchInput = z.input<typeof companyResearchSchema>;
