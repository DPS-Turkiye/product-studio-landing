import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import en from "../../messages/en.json";
import tr from "../../messages/tr.json";
import type { ReactNode } from "react";

export function renderForm(ui: ReactNode, locale: "en" | "tr" = "en") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <NextIntlClientProvider
      locale={locale}
      messages={locale === "tr" ? tr : en}
    >
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    </NextIntlClientProvider>,
  );
}
