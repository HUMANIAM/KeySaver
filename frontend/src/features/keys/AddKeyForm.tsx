import { Button } from '../../shared/ui/button';
import { Input } from '../../shared/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../shared/ui/card';
import { KeyEntry } from '../../shared/types';

// Shared form components
import {
  FormField,
  SecretInput,
  TagsInput,
  ErrorAlert,
} from '../../shared/components/forms';

// Custom hooks
import { useVisibilityToggle, useTagsManager, useFormState } from '../../shared/hooks';

interface AddKeyFormProps {
  onAdd: (key: string, value: string, tags: string[]) => Promise<void>;
  entries: KeyEntry[];
}

// Pure validation function
function validateKeyValueForm(values: { key: string; value: string }, existingKeys: string[]) {
  const errors: Record<string, string> = {};

  if (!values.key.trim()) {
    errors.key = 'Key name is required';
  } else if (existingKeys.includes(values.key.trim())) {
    errors.key = 'Key name already exists';
  }

  if (!values.value.trim()) {
    errors.value = 'Value is required';
  }

  return errors;
}

// Sub-components for composition

/** Form header with title and description */
function FormHeader() {
  return (
    <CardHeader>
      <CardTitle>Add New Key</CardTitle>
      <CardDescription>
        Store a new encrypted key-value pair with optional tags
      </CardDescription>
    </CardHeader>
  );
}

/** Key name input field */
function KeyNameField({
  value,
  error,
  onChange,
}: {
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <FormField
      id="key"
      label="Key"
      error={error}
      helpText="Unique identifier for your secret"
    >
      <Input
        id="key"
        placeholder="Enter key name (e.g., API_KEY)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
        required
      />
    </FormField>
  );
}

/** Secret value input field with visibility toggle */
function SecretValueField({
  value,
  error,
  isVisible,
  onValueChange,
  onToggleVisibility,
}: {
  value: string;
  error?: string;
  isVisible: boolean;
  onValueChange: (value: string) => void;
  onToggleVisibility: () => void;
}) {
  return (
    <FormField
      id="value"
      label="Value (Secret)"
      error={error}
      helpText="The secret value will be encrypted on your device"
    >
      <SecretInput
        id="value"
        value={value}
        onChange={onValueChange}
        isVisible={isVisible}
        onToggleVisibility={onToggleVisibility}
        required
      />
    </FormField>
  );
}

/** Tags input field */
function TagsField({
  tags,
  inputValue,
  onInputChange,
  onAddTag,
  onRemoveTag,
  maxTags,
}: {
  tags: string[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
  maxTags: number;
}) {
  return (
    <FormField id="tags" label="Tags (Optional)" helpText="Add tags to organize your keys">
      <TagsInput
        id="tags"
        tags={tags}
        inputValue={inputValue}
        onInputChange={onInputChange}
        onAddTag={onAddTag}
        onRemoveTag={onRemoveTag}
        maxTags={maxTags}
      />
    </FormField>
  );
}

/** Submit button with loading state */
function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <Button type="submit" className="w-full" disabled={isSubmitting}>
      {isSubmitting ? 'Adding...' : 'Add Key'}
    </Button>
  );
}

export function AddKeyForm({ onAdd, entries }: AddKeyFormProps) {
  // State management hooks
  const secretVisibility = useVisibilityToggle();
  const tagsManager = useTagsManager({ maxTags: 10 });

  // Extract existing keys for validation
  const existingKeys = entries.map((e) => e.key);

  // Form submission handler
  const handleSubmit = async (values: { key: string; value: string }) => {
    await onAdd(values.key.trim(), values.value, tagsManager.tags);
    secretVisibility.hide();
    tagsManager.clearTags();
  };

  // Form state with validation
  const form = useFormState({
    initialValues: { key: '', value: '' },
    validate: (values) => validateKeyValueForm(values, existingKeys),
    onSubmit: handleSubmit,
  });

  return (
    <Card>
      <FormHeader />
      <CardContent>
        <form onSubmit={form.handleSubmit} className="space-y-4">
          {form.submitError && <ErrorAlert message={form.submitError} />}

          <KeyNameField
            value={form.values.key}
            error={form.errors.key}
            onChange={(value) => form.setValue('key', value)}
          />

          <SecretValueField
            value={form.values.value}
            error={form.errors.value}
            isVisible={secretVisibility.isVisible}
            onValueChange={(value) => form.setValue('value', value)}
            onToggleVisibility={secretVisibility.toggle}
          />

          <TagsField
            tags={tagsManager.tags}
            inputValue={tagsManager.inputValue}
            onInputChange={tagsManager.setInputValue}
            onAddTag={tagsManager.addTag}
            onRemoveTag={tagsManager.removeTag}
            maxTags={10}
          />

          <SubmitButton isSubmitting={form.isSubmitting} />
        </form>
      </CardContent>
    </Card>
  );
}
