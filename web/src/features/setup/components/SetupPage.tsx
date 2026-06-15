import Header from "@/src/components/layouts/header";
import ContainerPage from "@/src/components/layouts/container-page";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Card } from "@/src/components/ui/card";
import { NewOrganizationForm } from "@/src/features/organizations/components/NewOrganizationForm";
import { NewProjectForm } from "@/src/features/projects/components/NewProjectForm";
import { useQueryProjectOrOrganization } from "@/src/features/projects/hooks";
import { createProjectRoute } from "@/src/features/setup/setupRoutes";
import { cn } from "@/src/utils/tailwind";
import { useI18n } from "@/src/features/i18n/I18nProvider";
import { Check } from "lucide-react";
import { useRouter } from "next/router";

// Manual setup process
// 1. Create Organization: /setup
// 2. Create Project: /organization/:orgId/setup?orgstep=create-project
export function SetupPage() {
  const { organization } = useQueryProjectOrOrganization();
  const router = useRouter();
  const { translateText } = useI18n();

  // starts at 1 to align with breadcrumb
  const stepInt = organization ? 2 : 1;

  return (
    <ContainerPage
      headerProps={{
        title: translateText("Setup"),
        help: {
          description: translateText(
            "Create a new organization. This will be used to manage your projects and teams.",
          ),
        },
        ...(stepInt === 1 && {
          breadcrumb: [
            {
              name: translateText("Organizations"),
              href: "/",
            },
          ],
        }),
      }}
    >
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage
              className={cn(
                stepInt !== 1
                  ? "text-muted-foreground"
                  : "text-foreground font-semibold",
              )}
            >
              {translateText("1. Create Organization")}
              {stepInt > 1 && <Check className="ml-1 inline-block h-3 w-3" />}
            </BreadcrumbPage>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage
              className={cn(
                stepInt !== 2
                  ? "text-muted-foreground"
                  : "text-foreground font-semibold",
              )}
            >
              {translateText("2. Create Project")}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card className="p-3">
        {
          // 1. Create Org
          stepInt === 1 && (
            <div>
              <Header title={translateText("New Organization")} />
              <p className="text-muted-foreground mb-4 text-sm">
                {translateText(
                  "Organizations are used to manage your projects and teams.",
                )}
              </p>
              <NewOrganizationForm
                onSuccess={(orgId) => {
                  router.push(createProjectRoute(orgId));
                }}
              />
            </div>
          )
        }
        {
          // 2. Create Project
          stepInt === 2 && organization && (
            <div>
              <Header title={translateText("New Project")} />
              <p className="text-muted-foreground mb-4 text-sm">
                {translateText(
                  "Projects are used to group traces, datasets, evals and prompts. Environments can be separated using the built-in environment feature.",
                )}
              </p>
              <NewProjectForm
                orgId={organization.id}
                onSuccess={(projectId) =>
                  router.push(`/project/${projectId}/traces`)
                }
              />
            </div>
          )
        }
      </Card>
    </ContainerPage>
  );
}
