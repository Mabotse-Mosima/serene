import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Phone } from "lucide-react"

export default function ResourcesSection() {
  return (
    <div className="space-y-4 mt-4">
      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <h3 className="text-sm font-medium text-red-800 flex items-center">
          <Phone className="h-4 w-4 mr-1" />
          Emergency Help
        </h3>
        <p className="text-xs text-red-700 mt-1">If you're in crisis or having thoughts of suicide, please call:</p>
        <ul className="mt-2 space-y-2">
          <li className="text-xs">
            <strong className="font-medium">988</strong> - Suicide & Crisis Lifeline
          </li>
          <li className="text-xs">
            <strong className="font-medium">911</strong> - Emergency Services
          </li>
        </ul>
      </div>

      <Card className="border-purple-100">
        <CardContent className="p-3">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Professional Resources</h3>
          <ul className="space-y-2">
            <ResourceLink
              title="Find a Therapist"
              description="Psychology Today Therapist Directory"
              url="https://www.psychologytoday.com/us/therapists"
            />
            <ResourceLink
              title="Online Therapy"
              description="Affordable online counseling"
              url="https://www.betterhelp.com"
            />
            <ResourceLink
              title="Mental Health America"
              description="Resources and screening tools"
              url="https://www.mhanational.org"
            />
          </ul>
        </CardContent>
      </Card>

      <Card className="border-purple-100">
        <CardContent className="p-3">
          <h3 className="text-sm font-medium text-purple-800 mb-2">Self-Help Resources</h3>
          <ul className="space-y-2">
            <ResourceLink
              title="Mindfulness Exercises"
              description="Free guided meditations"
              url="https://www.mindful.org/category/meditation/guided-meditation/"
            />
            <ResourceLink
              title="Mental Health Apps"
              description="Top-rated wellness applications"
              url="https://www.psycom.net/25-best-mental-health-apps"
            />
            <ResourceLink
              title="Self-Care Assessment"
              description="Evaluate your self-care routine"
              url="https://www.therapistaid.com/therapy-worksheet/self-care-assessment"
            />
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function ResourceLink({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <li className="text-xs">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-start hover:bg-purple-50 p-1 rounded-sm transition-colors"
      >
        <div className="flex-1">
          <p className="font-medium text-purple-700">{title}</p>
          <p className="text-gray-600">{description}</p>
        </div>
        <ExternalLink className="h-3 w-3 text-purple-400 mt-1 flex-shrink-0" />
      </a>
    </li>
  )
}
