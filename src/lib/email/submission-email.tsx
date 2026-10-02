import { absoluteUrl } from "@/lib/site-url";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { englishUpper } from "./rows";
import type { EmailRow } from "./rows";

const black = "#0b0d14";
const purple = "#5832ff";
const lime = "#a6ff00";
const muted = "#5c6170";
const line = "#e4e5ea";
const paper = "#f4f5f7";
const font = "'Avenir Next', 'Segoe UI', Helvetica, Arial, sans-serif";

const logoWidth = 280;
const logoHeight = 135;

export function SubmissionEmail({
  preview,
  eyebrow,
  title,
  lede,
  replyTo,
  replyLabel,
  rows,
}: {
  preview: string;
  eyebrow: string;
  title: string;
  lede: string;
  replyTo: string;
  replyLabel: string;
  rows: EmailRow[];
}) {
  const logo = absoluteUrl("/images/logo-email.png");
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, backgroundColor: paper, fontFamily: font }}>
        <Container
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "32px auto",
            backgroundColor: "#ffffff",
            border: `2px solid ${black}`,
          }}
        >
          <Section
            style={{ backgroundColor: black, padding: "28px 32px 24px" }}
          >
            <Img
              src={logo}
              alt="Product Studio"
              width={logoWidth}
              height={logoHeight}
              style={{ display: "block", margin: "0 auto" }}
            />
          </Section>
          <Hr
            style={{
              border: "none",
              borderTop: `6px solid ${lime}`,
              margin: 0,
            }}
          />
          <Section style={{ padding: "32px 32px 8px" }}>
            <Text
              style={{
                margin: "0 0 10px",
                color: purple,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.14em",
              }}
            >
              {englishUpper(eyebrow)}
            </Text>
            <Heading
              as="h1"
              style={{
                margin: 0,
                color: black,
                fontSize: "32px",
                lineHeight: "1.05",
                fontWeight: 700,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </Heading>
            <Text
              style={{
                margin: "12px 0 0",
                color: muted,
                fontSize: "16px",
                lineHeight: "1.4",
              }}
            >
              {lede}
            </Text>
            <Button
              href={`mailto:${replyTo}`}
              style={{
                display: "inline-block",
                marginTop: "22px",
                backgroundColor: lime,
                color: black,
                fontSize: "13px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textDecoration: "none",
                padding: "14px 22px",
                borderRadius: 0,
              }}
            >
              {englishUpper(replyLabel)}
            </Button>
          </Section>
          <Section style={{ padding: "8px 32px 28px" }}>
            {rows.map((row) => (
              <Field key={row.label} row={row} />
            ))}
          </Section>
          <Section style={{ backgroundColor: black, padding: "22px 32px" }}>
            <Text
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Reply goes straight to the person who sent this form.
            </Text>
            <Link
              href={absoluteUrl("/")}
              style={{
                color: lime,
                fontSize: "13px",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              productstudio.com.tr
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Field({ row }: { row: EmailRow }) {
  if (row.long) {
    return (
      <Section
        style={{
          margin: "18px 0 0",
          padding: "16px 18px",
          backgroundColor: paper,
          borderLeft: `4px solid ${purple}`,
        }}
      >
        <Text style={labelStyle}>{englishUpper(row.label)}</Text>
        <Text
          style={{
            margin: "6px 0 0",
            color: black,
            fontSize: "15px",
            lineHeight: "1.55",
            whiteSpace: "pre-wrap",
          }}
        >
          {row.value}
        </Text>
      </Section>
    );
  }

  return (
    <Section
      style={{ borderBottom: `1px solid ${line}`, padding: "12px 0 10px" }}
    >
      <Text style={labelStyle}>{englishUpper(row.label)}</Text>
      {row.href ? (
        <Link
          href={row.href}
          style={{
            color: purple,
            fontSize: "16px",
            lineHeight: "1.4",
            textDecoration: "underline",
          }}
        >
          {row.value}
        </Link>
      ) : (
        <Text
          style={{
            margin: "4px 0 0",
            color: black,
            fontSize: "16px",
            lineHeight: "1.4",
          }}
        >
          {row.value}
        </Text>
      )}
    </Section>
  );
}

const labelStyle = {
  margin: 0,
  color: muted,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
};
