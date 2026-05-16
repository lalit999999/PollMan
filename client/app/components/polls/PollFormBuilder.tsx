import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useFieldArray,
  useForm,
  useWatch,
  type FieldErrors,
  type SubmitHandler,
} from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import {
  ArrowLeft,
  CalendarDays,
  Flame,
  GripVertical,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { PollFormValues } from "../../services/pollService";

export type PollFormMode = "create" | "edit";

type PollFormBuilderProps = {
  mode: PollFormMode;
  initialValues: PollFormValues;
  initialPublished?: boolean;
  title: string;
  subtitle: string;
  saveLabel?: string;
  publishLabel?: string;
  onSave: (values: PollFormValues) => Promise<void>;
  onPublish?: (values: PollFormValues) => Promise<void>;
  onCancel?: () => void;
};

const createQuestion = () => ({
  text: "",
  isRequired: true,
  allowOpinionText: false,
  options: [{ text: "" }, { text: "" }],
});

function toDateTimeLocalValue(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60 * 1000;
  const local = new Date(date.getTime() - offset);
  return local.toISOString().slice(0, 16);
}

function validateValues(values: PollFormValues, mode: PollFormMode = "create") {
  if (!values.title.trim()) {
    return "Poll title is required.";
  }

  if (!values.questions.length) {
    return "Add at least one question.";
  }

  if (!values.expiresAt) {
    return "Expiry date is required.";
  }

  const expiresAt = new Date(values.expiresAt);
  if (Number.isNaN(expiresAt.getTime())) {
    return "Please choose a valid expiry date and time.";
  }

  // For create mode, expiry must be in the future
  // For edit mode, allow keeping the existing date (which may be in the past if poll is already expired)
  if (mode === "create" && expiresAt.getTime() <= Date.now()) {
    return "Expiry time must be in the future.";
  }

  for (let index = 0; index < values.questions.length; index += 1) {
    const question = values.questions[index];

    if (!question.text.trim()) {
      return `Question ${index + 1} text is required.`;
    }

    // Skip option validation if this is an opinion-only question
    if (question.allowOpinionText) {
      continue;
    }

    const optionTexts = question.options
      .map((option) => option.text.trim())
      .filter(Boolean);
    if (optionTexts.length < 2) {
      return `Question ${index + 1} needs at least 2 options.`;
    }

    if (optionTexts.length !== question.options.length) {
      return `Question ${index + 1} has an empty option.`;
    }
  }

  return null;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-400 mt-1">{message}</p>;
}

function QuestionEditor({
  index,
  control,
  register,
  errors,
  removeQuestion,
  canRemove,
}: {
  index: number;
  control: ReturnType<typeof useForm<PollFormValues>>["control"];
  register: ReturnType<typeof useForm<PollFormValues>>["register"];
  errors: FieldErrors<PollFormValues>;
  removeQuestion: (index: number) => void;
  canRemove: boolean;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${index}.options` as const,
  });

  const allowOpinionText = useWatch({
    control,
    name: `questions.${index}.allowOpinionText`,
  });

  const questionErrors = errors.questions?.[index] as
    | {
        text?: { message?: string };
        options?: Array<{ text?: { message?: string } }>;
      }
    | undefined;

  return (
    <Card className="glass border-border/60 shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="mt-2 cursor-grab text-muted-foreground hover:text-foreground transition-colors">
            <GripVertical className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-full">
                  Question {index + 1}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Single choice
                </Badge>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                onClick={() => removeQuestion(index)}
                disabled={!canRemove}
                title="Remove question"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Question text"
                className="h-12 text-base bg-background"
                {...register(`questions.${index}.text` as const, {
                  required: "Question text is required.",
                })}
              />
              <FieldError message={questionErrors?.text?.message} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pl-14 pb-6">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/60 bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`questions.${index}.isRequired` as const}
              render={({ field }) => (
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div>
              <div className="text-sm font-medium">Required question</div>
              <div className="text-xs text-muted-foreground">
                Respondents must answer this question.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Controller
              control={control}
              name={`questions.${index}.allowOpinionText` as const}
              render={({ field }) => (
                <Switch
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <div>
              <div className="text-sm font-medium">Allow opinion text</div>
              <div className="text-xs text-muted-foreground">
                Show a text area for respondents on this question.
              </div>
            </div>
          </div>
          {!allowOpinionText && (
            <div className="ml-auto text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {fields.length} options
            </div>
          )}
        </div>

        {allowOpinionText ? (
          <div className="flex items-center justify-center gap-3 rounded-lg border-2 border-dashed border-amber-500/30 bg-amber-500/10 p-6">
            <div className="text-center">
              <p className="font-semibold text-sm text-amber-900/80">
                Opinion only
              </p>
              <p className="text-xs text-amber-900/60">
                Respondents will only provide text opinions for this question.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {fields.map((field, optionIndex) => {
              const optionError =
                questionErrors?.options?.[optionIndex]?.text?.message;

              return (
                <div key={field.id} className="flex items-start gap-3">
                  <div className="mt-3 h-5 w-5 rounded-full border border-border flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                    {optionIndex + 1}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder={`Option ${optionIndex + 1}`}
                      className="bg-background"
                      {...register(
                        `questions.${index}.options.${optionIndex}.text` as const,
                        {
                          required: "Option text is required.",
                        },
                      )}
                    />
                    <FieldError message={optionError} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-0.5 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                    onClick={() => remove(optionIndex)}
                    disabled={fields.length <= 2}
                    title="Remove option"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {!allowOpinionText && (
          <Button
            type="button"
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50"
            onClick={() => append({ text: "" })}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add option
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function PollFormBuilder({
  mode,
  initialValues,
  initialPublished = false,
  title,
  subtitle,
  saveLabel,
  publishLabel,
  onSave,
  onPublish,
  onCancel,
}: PollFormBuilderProps) {
  const [isSubmitting, setIsSubmitting] = useState<"save" | "publish" | null>(
    null,
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const defaults = useMemo<PollFormValues>(
    () => ({
      title: initialValues.title || "",
      description: initialValues.description || "",
      isAnonymous: initialValues.isAnonymous || false,
      allowResultsPublish: initialValues.allowResultsPublish ?? true,
      passwordProtected: initialValues.passwordProtected ?? false,
      password: initialValues.password ?? null,
      isResponseLimited: initialValues.isResponseLimited ?? false,
      responseLimit: initialValues.responseLimit ?? null,
      expiresAt: toDateTimeLocalValue(initialValues.expiresAt),
      questions: initialValues.questions?.length
        ? initialValues.questions.map((question) => ({
            text: question.text || "",
            isRequired: question.isRequired ?? true,
            allowOpinionText: question.allowOpinionText ?? false,
            options: question.options?.length
              ? question.options.map((option) => ({ text: option.text || "" }))
              : [{ text: "" }, { text: "" }],
          }))
        : [createQuestion()],
    }),
    [initialValues],
  );

  const {
    control,
    register,
    reset,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<PollFormValues>({
    defaultValues: defaults,
    mode: "onBlur",
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  const watchedQuestions = watch("questions");
  const questionCountHint = `${watchedQuestions?.length || 0} question${(watchedQuestions?.length || 0) === 1 ? "" : "s"} ready`;
  const isAnonymous = watch("isAnonymous");
  const allowResultsPublish = watch("allowResultsPublish");
  const passwordProtected = watch("passwordProtected");

  const runAction = async (action: "save" | "publish") => {
    const values = getValues();
    const validationMessage = validateValues(values, mode);

    if (validationMessage) {
      setSubmitError(validationMessage);
      toast.error(validationMessage);
      return;
    }

    setSubmitError(null);
    setIsSubmitting(action);

    try {
      if (action === "publish" && onPublish) {
        await onPublish(values);
      } else {
        await onSave(values);
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the poll.";
      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(null);
    }
  };

  const onSaveClick: SubmitHandler<PollFormValues> = async () => {
    await runAction("save");
  };

  return (
    <form onSubmit={handleSubmit(onSaveClick)} className="space-y-8 pb-20">
      <div className="sticky top-0 z-20 -mx-4 border-b border-border bg-background/80 px-4 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              {mode === "create" ? "New poll" : "Edit poll"}
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Cancel
              </Button>
            ) : null}

            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={isSubmitting !== null}
              onClick={() => void runAction("save")}
            >
              <Save className="h-4 w-4" />
              {isSubmitting === "save"
                ? "Saving..."
                : saveLabel ||
                  (mode === "create" ? "Save Draft" : "Save Changes")}
            </Button>

            {onPublish ? (
              <>
                <Button
                  type="button"
                  className="gap-2"
                  disabled={isSubmitting !== null}
                  onClick={() => setShowPublishConfirm(true)}
                >
                  <Flame className="h-4 w-4" />
                  {isSubmitting === "publish"
                    ? "Publishing..."
                    : publishLabel ||
                      (mode === "create"
                        ? "Save & Publish"
                        : "Publish Results")}
                </Button>

                <AlertDialog
                  open={showPublishConfirm}
                  onOpenChange={(open) => setShowPublishConfirm(open)}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Publish this poll?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will make the poll available to respondents on the
                        public link.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex gap-3 justify-end">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          setShowPublishConfirm(false);
                          await runAction("publish");
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        Confirm
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            ) : null}
          </div>
        </div>

        {submitError ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300">
            {submitError}
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-6">
          <Card className="glass border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Poll details</CardTitle>
              <CardDescription>
                Give your poll a clear title and context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="title">Poll title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Employee feedback survey"
                  className="h-12 bg-background"
                  {...register("title", {
                    required: "Poll title is required.",
                  })}
                />
                <FieldError message={errors.title?.message} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Add a short description to help respondents understand the goal."
                  className="min-h-28 bg-background"
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Questions builder</h3>
                <p className="text-sm text-muted-foreground">
                  Build single-choice questions with required/optional rules.
                </p>
              </div>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {questionCountHint}
              </Badge>
            </div>

            <AnimatePresence mode="popLayout">
              {questionFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.18 }}
                >
                  <QuestionEditor
                    index={index}
                    control={control}
                    register={register}
                    errors={errors}
                    removeQuestion={removeQuestion}
                    canRemove={questionFields.length > 1}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed border-2 bg-transparent py-7 hover:bg-muted/50"
            onClick={() => appendQuestion(createQuestion())}
          >
            <Plus className="mr-2 h-5 w-5" />
            Add question
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="glass border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Poll settings</CardTitle>
              <CardDescription>
                Control access, expiry, and results visibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="space-y-1">
                  <Label htmlFor="isAnonymous" className="text-sm">
                    Anonymous responses
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Respondents can submit without being identified.
                  </p>
                </div>
                <Switch id="isAnonymous" {...register("isAnonymous")} />
              </div>

              <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <div className="space-y-1">
                  <Label htmlFor="allowResultsPublish" className="text-sm">
                    Allow result publishing
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable the final results page for this poll.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="allowResultsPublish"
                  render={({ field }) => (
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-2 rounded-2xl border border-border/60 bg-muted/20 p-4">
                <Label
                  htmlFor="expiresAt"
                  className="flex items-center gap-2 text-sm"
                >
                  <CalendarDays className="h-4 w-4 text-primary" />
                  Expiry date <span className="text-red-500">*</span>
                </Label>

                <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <div className="space-y-1">
                    <Label htmlFor="passwordProtected" className="text-sm">
                      Password protect poll
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Require a password for respondents to access this poll.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="passwordProtected"
                    render={({ field }) => (
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>

                {passwordProtected ? (
                  <div className="space-y-2">
                    <Label htmlFor="password">Response password</Label>
                    <Input
                      id="password"
                      placeholder="Enter a password respondents must use"
                      type="text"
                      className="bg-background"
                      {...register("password")}
                    />
                    <p className="text-xs text-muted-foreground">
                      Keep this secret — respondents will need this password to
                      answer the poll.
                    </p>
                  </div>
                ) : null}

                <div className="space-y-1">
                  <Label htmlFor="isResponseLimited" className="text-sm">
                    Limit responses
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Set a maximum number of responses this poll can accept.
                  </p>
                </div>
                <Controller
                  control={control}
                  name="isResponseLimited"
                  render={({ field }) => (
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />

                {watch("isResponseLimited") ? (
                  <div className="space-y-2">
                    <Label htmlFor="responseLimit">Response limit</Label>
                    <Input
                      id="responseLimit"
                      placeholder="Enter maximum number of responses"
                      type="number"
                      className="bg-background"
                      {...register("responseLimit", {
                        min: {
                          value: 1,
                          message: "Response limit must be at least 1",
                        },
                      })}
                    />
                    <p className="text-xs text-muted-foreground">
                      Once this limit is reached, no new responses will be
                      accepted.
                    </p>
                  </div>
                ) : null}

                <Input
                  id="expiresAt"
                  type="datetime-local"
                  className="bg-background"
                  {...register("expiresAt", {
                    required: "Expiry date is required",
                  })}
                  required={mode === "create"}
                />
                <p className="text-xs text-muted-foreground">
                  All polls must have an expiry date after which responses will
                  not be accepted.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>Publishing checklist</CardTitle>
              <CardDescription>
                Make sure the poll is ready before going live.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Questions added</span>
                <span className="font-medium">{questionFields.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Publish enabled</span>
                <span className="font-medium">
                  {allowResultsPublish ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">Anonymous mode</span>
                <span className="font-medium">
                  {isAnonymous ? "On" : "Off"}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-muted/20 px-4 py-3">
                <span className="text-muted-foreground">
                  Current visibility
                </span>
                <span className="font-medium">
                  {initialPublished ? "Published" : "Draft"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
