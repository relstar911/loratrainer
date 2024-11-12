import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

const formSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  negative_prompt: z.string().optional(),
  num_inference_steps: z.number().min(1).max(150),
  guidance_scale: z.number().min(1).max(20),
  width: z.number().min(128).max(1024),
  height: z.number().min(128).max(1024),
})

type FormData = z.infer<typeof formSchema>

export function GenerationForm({ projectId, onSubmit }: { 
  projectId: number;
  onSubmit: (data: FormData) => Promise<void>;
}) {
  const { toast } = useToast()
  const [isGenerating, setIsGenerating] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      negative_prompt: '',
      num_inference_steps: 50,
      guidance_scale: 7.5,
      width: 512,
      height: 512,
    },
  })

  const handleSubmit = async (data: FormData) => {
    try {
      setIsGenerating(true)
      await onSubmit(data)
      toast({
        title: 'Generation started',
        description: 'Your image is being generated...',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to start image generation',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label>Prompt</label>
        <Textarea
          {...form.register('prompt')}
          placeholder="A beautiful landscape..."
        />
      </div>

      <div className="space-y-2">
        <label>Negative Prompt</label>
        <Textarea
          {...form.register('negative_prompt')}
          placeholder="Low quality, blurry..."
        />
      </div>

      <div className="space-y-4">
        <div>
          <label>Steps: {form.watch('num_inference_steps')}</label>
          <Slider
            {...form.register('num_inference_steps')}
            min={1}
            max={150}
            step={1}
          />
        </div>

        <div>
          <label>Guidance Scale: {form.watch('guidance_scale')}</label>
          <Slider
            {...form.register('guidance_scale')}
            min={1}
            max={20}
            step={0.1}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label>Width</label>
            <Input
              type="number"
              {...form.register('width', { valueAsNumber: true })}
              min={128}
              max={1024}
              step={64}
            />
          </div>
          <div>
            <label>Height</label>
            <Input
              type="number"
              {...form.register('height', { valueAsNumber: true })}
              min={128}
              max={1024}
              step={64}
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Generate Image'}
      </Button>
    </form>
  )
} 