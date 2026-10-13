import type { Field } from "@/lib/collections";
import { ImageField } from "./ImageField";
import { SlugField } from "./SlugField";
import { MarkdownField } from "./MarkdownField";

function toLocalInput(v: unknown): string {
  if (!v) return "";
  const d = v instanceof Date ? v : new Date(String(v));
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function FieldRenderer({ field, value }: { field: Field; value: unknown }) {
  const f = field;
  const str = value == null ? "" : String(value);
  let control: React.ReactNode;
  switch (f.type) {
    case "textarea":
      control = <textarea name={f.name} defaultValue={str} rows={f.rows ?? 4} required={f.required} className="input" />; break;
    case "markdown":
      control = <MarkdownField name={f.name} defaultValue={str} rows={f.rows} required={f.required} />; break;
    case "image":
      control = <ImageField name={f.name} defaultValue={str} required={f.required} />; break;
    case "boolean":
      control = (
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="hidden" name={f.name} value="false" />
          <input type="checkbox" name={f.name} value="true" defaultChecked={Boolean(value)} className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
          Enabled
        </label>
      ); break;
    case "select":
      control = (
        <select name={f.name} defaultValue={str} className="input">
          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ); break;
    case "number":
      control = <input type="number" name={f.name} defaultValue={str} required={f.required} className="input" />; break;
    case "datetime":
      control = <input type="datetime-local" name={f.name} defaultValue={toLocalInput(value)} required={f.required} className="input" />; break;
    case "slug":
      control = <SlugField name={f.name} from={f.from} defaultValue={str} />; break;
    case "url":
      control = <input type="url" name={f.name} defaultValue={str} required={f.required} className="input" placeholder="https://" />; break;
    case "email":
      control = <input type="email" name={f.name} defaultValue={str} required={f.required} className="input" />; break;
    default:
      control = <input type="text" name={f.name} defaultValue={str} required={f.required} className="input" />;
  }
  return (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {f.label}{f.required && <span className="text-red-500"> *</span>}
      </label>
      {control}
      {f.help && <p className="mt-1 text-xs text-gray-500">{f.help}</p>}
    </div>
  );
}

/** Parse a submitted form against a field list into a Prisma-ready object. */
export function parseFields(fields: Field[], formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const f of fields) {
    const raw = formData.getAll(f.name);
    const last = raw.length ? String(raw[raw.length - 1]) : "";
    switch (f.type) {
      case "boolean": out[f.name] = last === "true"; break;
      case "number": out[f.name] = last === "" ? 0 : Number(last); break;
      case "datetime": out[f.name] = last ? new Date(last) : null; break;
      default: out[f.name] = last.trim();
    }
  }
  return out;
}
