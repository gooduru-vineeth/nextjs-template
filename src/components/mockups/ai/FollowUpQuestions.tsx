'use client';

import { Check, ChevronRight, Edit2, HelpCircle, Plus, RefreshCw, Sparkles, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

export type FollowUpQuestion = {
  id: string;
  text: string;
  category?: 'clarification' | 'exploration' | 'related' | 'deep-dive';
  icon?: string;
};

export type FollowUpQuestionsProps = {
  variant?: 'full' | 'compact' | 'chips' | 'list' | 'inline';
  questions?: FollowUpQuestion[];
  onChange?: (questions: FollowUpQuestion[]) => void;
  onSelect?: (question: FollowUpQuestion) => void;
  maxQuestions?: number;
  editable?: boolean;
  showCategories?: boolean;
  title?: string;
  className?: string;
};

const defaultQuestions: FollowUpQuestion[] = [
  { id: '1', text: 'Can you explain that in more detail?', category: 'clarification' },
  { id: '2', text: 'What are some real-world examples?', category: 'exploration' },
  { id: '3', text: 'How does this compare to alternatives?', category: 'related' },
  { id: '4', text: 'What are the potential drawbacks?', category: 'deep-dive' },
];

const categoryStyles: Record<string, { label: string; color: string; icon: string }> = {
  'clarification': { label: 'Clarify', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: '❓' },
  'exploration': { label: 'Explore', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: '🔍' },
  'related': { label: 'Related', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: '🔗' },
  'deep-dive': { label: 'Deep Dive', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: '🎯' },
};

const FollowUpQuestions: React.FC<FollowUpQuestionsProps> = ({
  variant = 'full',
  questions = defaultQuestions,
  onChange,
  onSelect,
  maxQuestions = 6,
  editable = false,
  showCategories = true,
  title = 'Follow-up questions',
  className = '',
}) => {
  const [questionList, setQuestionList] = useState<FollowUpQuestion[]>(questions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    setQuestionList(questions);
  }, [questions]);

  const handleSelect = useCallback((question: FollowUpQuestion) => {
    onSelect?.(question);
  }, [onSelect]);

  const addQuestion = useCallback(() => {
    if (questionList.length >= maxQuestions) {
      return;
    }
    const newQuestion: FollowUpQuestion = {
      id: `q-${Date.now()}`,
      text: 'New follow-up question',
      category: 'exploration',
    };
    const newQuestions = [...questionList, newQuestion];
    setQuestionList(newQuestions);
    onChange?.(newQuestions);
    setEditingId(newQuestion.id);
    setEditText(newQuestion.text);
  }, [questionList, maxQuestions, onChange]);

  const removeQuestion = useCallback((id: string) => {
    const newQuestions = questionList.filter(q => q.id !== id);
    setQuestionList(newQuestions);
    onChange?.(newQuestions);
  }, [questionList, onChange]);

  const updateQuestion = useCallback((id: string, text: string) => {
    const newQuestions = questionList.map(q =>
      q.id === id ? { ...q, text } : q,
    );
    setQuestionList(newQuestions);
    onChange?.(newQuestions);
    setEditingId(null);
  }, [questionList, onChange]);

  const startEditing = useCallback((question: FollowUpQuestion) => {
    setEditingId(question.id);
    setEditText(question.text);
  }, []);

  const regenerateQuestions = useCallback(() => {
    // In real implementation, this would call an AI to generate new questions
    const newQuestions: FollowUpQuestion[] = [
      { id: `q-${Date.now()}-1`, text: 'What would happen if we changed this approach?', category: 'exploration' },
      { id: `q-${Date.now()}-2`, text: 'Are there any edge cases to consider?', category: 'deep-dive' },
      { id: `q-${Date.now()}-3`, text: 'How does this scale with larger datasets?', category: 'related' },
    ];
    setQuestionList(newQuestions);
    onChange?.(newQuestions);
  }, [onChange]);

  // Inline variant - horizontal scrollable chips
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 overflow-x-auto pb-2 ${className}`}>
        <span className="flex-shrink-0 text-xs text-gray-500 dark:text-gray-400">
          Ask:
        </span>
        {questionList.map(question => (
          <button
            key={question.id}
            onClick={() => handleSelect(question)}
            className="flex-shrink-0 rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
          >
            {question.text}
          </button>
        ))}
      </div>
    );
  }

  // Chips variant - wrapped chips
  if (variant === 'chips') {
    return (
      <div className={`${className}`}>
        {title && (
          <div className="mb-3 flex items-center gap-2">
            <HelpCircle size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {questionList.map(question => (
            <button
              key={question.id}
              onClick={() => handleSelect(question)}
              className="group flex items-center gap-2 rounded-xl bg-gray-100 px-3 py-2 transition-colors hover:bg-blue-50 dark:bg-gray-800 dark:hover:bg-blue-900/20"
            >
              {showCategories && question.category && (
                <span className="text-sm">{categoryStyles[question.category]?.icon}</span>
              )}
              <span className="text-sm text-gray-700 group-hover:text-blue-700 dark:text-gray-300 dark:group-hover:text-blue-400">
                {question.text}
              </span>
              <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-500" />
            </button>
          ))}
          {editable && questionList.length < maxQuestions && (
            <button
              onClick={addQuestion}
              className="flex items-center gap-1 rounded-xl border border-dashed border-blue-300 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <Plus size={14} />
              Add
            </button>
          )}
        </div>
      </div>
    );
  }

  // List variant - vertical list
  if (variant === 'list') {
    return (
      <div className={`space-y-2 ${className}`}>
        {questionList.map(question => (
          <div
            key={question.id}
            className="group flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
          >
            {showCategories && question.category && (
              <span className={`rounded px-2 py-0.5 text-xs ${categoryStyles[question.category]?.color}`}>
                {categoryStyles[question.category]?.label}
              </span>
            )}
            {editingId === question.id
              ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      className="flex-1 rounded border border-gray-200 bg-white px-2 py-1 text-sm dark:border-gray-700 dark:bg-gray-800"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateQuestion(question.id, editText);
                        }
                        if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                    />
                    <button
                      onClick={() => updateQuestion(question.id, editText)}
                      className="rounded p-1 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20"
                    >
                      <Check size={14} />
                    </button>
                  </div>
                )
              : (
                  <>
                    <button
                      onClick={() => handleSelect(question)}
                      className="flex-1 text-left text-sm text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                    >
                      {question.text}
                    </button>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                      {editable && (
                        <>
                          <button
                            onClick={() => startEditing(question)}
                            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <X size={12} />
                          </button>
                        </>
                      )}
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  </>
                )}
          </div>
        ))}
      </div>
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={`rounded-xl bg-gray-50 p-4 dark:bg-gray-800/50 ${className}`}>
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-purple-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          </div>
          {editable && (
            <button
              onClick={regenerateQuestions}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              title="Regenerate"
            >
              <RefreshCw size={14} />
            </button>
          )}
        </div>
        <div className="space-y-1">
          {questionList.slice(0, 4).map(question => (
            <button
              key={question.id}
              onClick={() => handleSelect(question)}
              className="flex w-full items-center gap-2 rounded-lg p-2 text-left text-sm text-gray-600 transition-colors hover:bg-white hover:text-blue-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-blue-400"
            >
              <ChevronRight size={14} className="flex-shrink-0" />
              <span className="line-clamp-1">{question.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-200">
            <HelpCircle size={18} />
            {title}
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {questionList.length}
              {' '}
              questions
            </span>
            {editable && (
              <>
                <button
                  onClick={regenerateQuestions}
                  className="rounded p-1.5 text-gray-400 hover:bg-purple-50 hover:text-purple-500 dark:hover:bg-purple-900/20"
                  title="Regenerate questions"
                >
                  <RefreshCw size={16} />
                </button>
                {questionList.length < maxQuestions && (
                  <button
                    onClick={addQuestion}
                    className="rounded p-1.5 text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900/30"
                  >
                    <Plus size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {questionList.map(question => (
          <div
            key={question.id}
            className="group p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
          >
            <div className="flex items-start gap-3">
              {/* Category indicator */}
              {showCategories && question.category && (
                <div className="flex-shrink-0">
                  <span className={`inline-flex items-center gap-1 rounded px-2 py-1 text-xs ${categoryStyles[question.category]?.color}`}>
                    <span>{categoryStyles[question.category]?.icon}</span>
                    <span>{categoryStyles[question.category]?.label}</span>
                  </span>
                </div>
              )}

              {/* Question content */}
              <div className="min-w-0 flex-1">
                {editingId === question.id
                  ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          className="flex-1 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateQuestion(question.id, editText);
                            }
                            if (e.key === 'Escape') {
                              setEditingId(null);
                            }
                          }}
                        />
                        <button
                          onClick={() => updateQuestion(question.id, editText)}
                          className="rounded-lg p-2 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/20"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )
                  : (
                      <button
                        onClick={() => handleSelect(question)}
                        className="w-full text-left text-gray-700 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                      >
                        {question.text}
                      </button>
                    )}
              </div>

              {/* Actions */}
              {!editingId && (
                <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {editable && (
                    <>
                      <button
                        onClick={() => startEditing(question)}
                        className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                      >
                        <X size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleSelect(question)}
                    className="rounded p-1.5 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add button */}
      {editable && questionList.length < maxQuestions && (
        <div className="border-t border-gray-100 p-4 dark:border-gray-800">
          <button
            onClick={addQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-blue-300 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
          >
            <Plus size={16} />
            Add Follow-up Question
          </button>
        </div>
      )}
    </div>
  );
};

export default FollowUpQuestions;
