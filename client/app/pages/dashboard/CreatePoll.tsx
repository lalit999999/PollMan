import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Switch } from "../../components/ui/switch";
import { Plus, Trash2, GripVertical, Settings2, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type FormValues = {
  title: string;
  description: string;
  isAnonymous: boolean;
  questions: {
    text: string;
    type: "single" | "multiple" | "text";
    required: boolean;
    options: { value: string }[];
  }[];
};

export default function CreatePoll() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"build" | "settings">("build");

  const { register, control, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      isAnonymous: false,
      questions: [
        { text: "", type: "single", required: true, options: [{ value: "Option 1" }, { value: "Option 2" }] }
      ]
    }
  });

  const { fields: questionFields, append: appendQuestion, remove: removeQuestion } = useFieldArray({
    control,
    name: "questions"
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    toast.success("Poll created successfully!");
    navigate("/app/polls/1");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md py-4 z-20 -mx-4 px-4 sm:-mx-8 sm:px-8 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Create Poll</h2>
          <p className="text-muted-foreground">Build your perfect survey or poll.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} className="gap-2">
            <Save className="w-4 h-4" />
            Save & Publish
          </Button>
        </div>
      </div>

      <div className="flex border-b border-border">
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === "build" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("build")}
        >
          Builder
        </button>
        <button
          className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${activeTab === "settings" ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          onClick={() => setActiveTab("settings")}
        >
          <Settings2 className="w-4 h-4" />
          Settings
        </button>
      </div>

      {activeTab === "build" && (
        <div className="space-y-6">
          <Card className="glass">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base">Poll Title</Label>
                <Input 
                  id="title" 
                  placeholder="e.g. Employee Satisfaction Q3" 
                  className="text-lg h-12 bg-background"
                  {...register("title", { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Input 
                  id="description" 
                  placeholder="Briefly describe what this poll is about..." 
                  className="bg-background"
                  {...register("description")}
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {questionFields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="glass overflow-visible">
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                      <div className="flex items-center gap-3 w-full">
                        <div className="cursor-grab text-muted-foreground hover:text-foreground mt-2">
                          <GripVertical className="w-5 h-5" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Input
                            placeholder="Question text"
                            className="font-medium bg-background border-transparent hover:border-border focus:border-ring transition-colors"
                            {...register(`questions.${index}.text` as const, { required: true })}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                        onClick={() => removeQuestion(index)}
                        disabled={questionFields.length === 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </CardHeader>
                    
                    <CardContent className="pl-14">
                      {/* Simple options editor for single/multiple choice */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <select 
                            className="bg-background border border-border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            {...register(`questions.${index}.type` as const)}
                          >
                            <option value="single">Single Choice</option>
                            <option value="multiple">Multiple Choice</option>
                            <option value="text">Text Answer</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          {/* We'd typically map through options here, keeping it simpler for UI demo */}
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-border" />
                            <Input placeholder="Option 1" className="h-9 bg-background" defaultValue="Option 1" />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full border border-border" />
                            <Input placeholder="Option 2" className="h-9 bg-background" defaultValue="Option 2" />
                          </div>
                          <Button variant="ghost" size="sm" className="mt-2 text-muted-foreground">
                            <Plus className="w-4 h-4 mr-2" /> Add Option
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <Button 
            variant="outline" 
            className="w-full py-8 border-dashed border-2 bg-transparent hover:bg-muted/50 glass"
            onClick={() => appendQuestion({ text: "", type: "single", required: true, options: [{ value: "" }] })}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Question
          </Button>
        </div>
      )}

      {activeTab === "settings" && (
        <Card className="glass">
          <CardHeader>
            <CardTitle>Poll Settings</CardTitle>
            <CardDescription>Configure how users interact with your poll.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Anonymous Responses</Label>
                <p className="text-sm text-muted-foreground">Don't collect user data or require login.</p>
              </div>
              {/* Fake Switch for UI */}
              <div className="w-11 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Multiple Submissions</Label>
                <p className="text-sm text-muted-foreground">Allow users to submit more than once.</p>
              </div>
              <div className="w-11 h-6 bg-muted rounded-full relative cursor-pointer">
                <div className="w-5 h-5 bg-white dark:bg-zinc-300 rounded-full absolute left-0.5 top-0.5 shadow-sm" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
