'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { outcomeAPI } from '@/utils/fetchWrapper';
import { SuccessMetric } from '@/app/types/outcomeTypes';

interface SuccessMetricFormProps {
  outcomeId: string;
  metric?: SuccessMetric;
  mode: 'create' | 'edit';
}

export default function SuccessMetricForm({ outcomeId, metric, mode }: SuccessMetricFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    metric_name: metric?.metric_name || '',
    target_value: metric?.target_value || 0,
    current_value: metric?.current_value || 0,
    unit: metric?.unit || '',
    description: metric?.description || '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (mode === 'create') {
        await outcomeAPI.post('/success-metrics', {
          ...formData,
          outcome_id: outcomeId,
        });
      } else {
        await outcomeAPI.patch(`/success-metrics/${metric?.id}`, formData);
      }
      router.push(`/u/outcomes/${outcomeId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save success metric');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="metric_name" className="block text-sm font-medium text-gray-700 mb-2">
          Metric Name
        </label>
        <input
          type="text"
          id="metric_name"
          required
          value={formData.metric_name}
          onChange={(e) => setFormData({ ...formData, metric_name: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., Monthly Active Users"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="target_value" className="block text-sm font-medium text-gray-700 mb-2">
            Target Value
          </label>
          <input
            type="number"
            id="target_value"
            required
            min="0"
            step="0.01"
            value={formData.target_value}
            onChange={(e) => setFormData({ ...formData, target_value: parseFloat(e.target.value) })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="1000"
          />
        </div>

        <div>
          <label htmlFor="current_value" className="block text-sm font-medium text-gray-700 mb-2">
            Current Value
          </label>
          <input
            type="number"
            id="current_value"
            required
            min="0"
            step="0.01"
            value={formData.current_value}
            onChange={(e) => setFormData({ ...formData, current_value: parseFloat(e.target.value) })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="750"
          />
        </div>
      </div>

      <div>
        <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
          Unit
        </label>
        <input
          type="text"
          id="unit"
          required
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="e.g., users, %, customers, revenue"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Describe this success metric..."
        />
      </div>

      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : mode === 'create' ? 'Create Metric' : 'Update Metric'}
        </button>
      </div>
    </form>
  );
}
