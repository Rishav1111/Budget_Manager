'use client';

import { useState, useEffect } from 'react';
import { Transaction } from '@/lib/api';

const TEMPLATES_STORAGE_KEY = 'transaction_templates';

export interface TransactionTemplate {
  id: string;
  name: string;
  transaction: Omit<Transaction, 'id'>;
  createdAt: string;
}

interface TransactionTemplatesProps {
  onUseTemplate: (template: Omit<Transaction, 'id'>) => void;
  onSaveTemplateRequest?: () => void;
  refreshKey?: number;
}

export default function TransactionTemplates({ 
  onUseTemplate,
  onSaveTemplateRequest,
  refreshKey = 0,
}: TransactionTemplatesProps) {
  const [templates, setTemplates] = useState<TransactionTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [editingTemplate, setEditingTemplate] = useState<TransactionTemplate | null>(null);

  useEffect(() => {
    loadTemplates();
  }, [refreshKey]);

  const loadTemplates = () => {
    try {
      const stored = localStorage.getItem(TEMPLATES_STORAGE_KEY);
      if (stored) {
        setTemplates(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const saveTemplates = (newTemplates: TransactionTemplate[]) => {
    try {
      localStorage.setItem(TEMPLATES_STORAGE_KEY, JSON.stringify(newTemplates));
      setTemplates(newTemplates);
    } catch (error) {
      console.error('Error saving templates:', error);
    }
  };

  const handleSaveTemplate = (transaction: Omit<Transaction, 'id'>) => {
    if (!templateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const newTemplate: TransactionTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      name: templateName.trim(),
      transaction,
      createdAt: editingTemplate?.createdAt || new Date().toISOString(),
    };

    const updatedTemplates = editingTemplate
      ? templates.map((t) => (t.id === editingTemplate.id ? newTemplate : t))
      : [...templates, newTemplate];

    saveTemplates(updatedTemplates);
    setTemplateName('');
    setShowForm(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      const updatedTemplates = templates.filter((t) => t.id !== id);
      saveTemplates(updatedTemplates);
    }
  };

  const handleUseTemplate = (template: TransactionTemplate) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    
    const templateData = {
      ...template.transaction,
      date: `${year}-${month}-${day}`,
    };
    
    // Load template into form via window method (if available)
    if ((window as any).loadTransactionTemplate) {
      (window as any).loadTransactionTemplate(template.transaction);
    }
    
    // Also call the callback
    onUseTemplate(templateData);
  };

  const startEdit = (template: TransactionTemplate) => {
    setEditingTemplate(template);
    setTemplateName(template.name);
    setShowForm(true);
  };

  if (templates.length === 0 && !showForm) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          No templates saved yet
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          Create Template
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Saved Templates
        </h3>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (showForm) {
              setTemplateName('');
              setEditingTemplate(null);
            }
          }}
          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
        >
          {showForm ? 'Cancel' : '+ New Template'}
        </button>
      </div>

      {showForm && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
            {editingTemplate
              ? 'Edit template name (transaction details will be saved from the form)'
              : 'Fill the transaction form above, then click "Save as Template" button in the form'}
          </p>
          {onSaveTemplateRequest && (
            <button
              onClick={() => {
                onSaveTemplateRequest();
                setShowForm(false);
              }}
              className="w-full px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition-colors"
            >
              Request Save (fill form first)
            </button>
          )}
        </div>
      )}

      <div className="space-y-2">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex items-center justify-between p-2 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {template.transaction.type === 'income' ? '+' : '-'}Rs.{template.transaction.amount} • {template.transaction.category}
              </div>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => handleUseTemplate(template)}
                className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                title="Use template"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button
                onClick={() => startEdit(template)}
                className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                title="Edit template"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => handleDeleteTemplate(template.id)}
                className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Delete template"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
