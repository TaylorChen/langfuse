import { type GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useI18n } from "@/src/features/i18n/I18nProvider";

// This url is deprecated, we keep this redirect page for backward compatibility
export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!context.params) {
    return {
      notFound: true,
    };
  }
  const projectId = context.params.projectId as string;

  return {
    redirect: {
      destination: `/project/${projectId}/evals`,
      permanent: false,
    },
  };
};

export default function RedirectPage() {
  const router = useRouter();
  const { translateText } = useI18n();
  if (router.isFallback) {
    return <div className="p-3">{translateText("Loading...")}</div>;
  }

  return <div>{translateText("Redirecting...")}</div>;
}
