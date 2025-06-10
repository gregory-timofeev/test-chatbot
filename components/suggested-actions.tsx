'use client';

import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useState, useMemo } from 'react';
import type { UseChatHelpers } from '@ai-sdk/react';
import type { VisibilityType } from './visibility-selector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { ChevronDown, Search } from 'lucide-react';

interface SuggestedActionsProps {
  chatId: string;
  append: UseChatHelpers['append'];
  selectedVisibilityType: VisibilityType;
  onRoleSelect?: (role: string, context: string) => void;
  isCompact?: boolean;
}

export function SuggestedActions({
  chatId,
  append,
  selectedVisibilityType,
  onRoleSelect,
  isCompact = false,
}: SuggestedActionsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const suggestedActions = [
    {
      title: 'Terraform',
      label: 'I will help you to manage your infrastructure as code',
      context: 'You are a Terraform expert. Help users with infrastructure as code, Terraform configurations, best practices, and troubleshooting. Provide clear, practical solutions.', 
    },
    {
      title: 'Pythonista',
      label: 'Create a python script to manage your data',
      context: 'You are a Python expert. Help users with Python programming, data analysis, scripting, libraries, and best practices. Write clean, efficient code with explanations.',
    },
    {
      title: 'TypeScripter',
      label: 'Build a shiny web app from scratch',
      context: 'You are a TypeScript/JavaScript expert. Help users build web applications, work with frameworks like React/Next.js, and write type-safe code.',
    },
    {
      title: 'DB Magician',
      label: 'Query your database with SQL',
      context: 'You are a database expert. Help users with SQL queries, database design, optimization, and troubleshooting across different database systems.',
    },
  ];

  const filteredActions = useMemo(() => {
    if (!searchTerm) return suggestedActions;
    
    return suggestedActions.filter(action =>
      action.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.context.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleRoleSelect = (title: string, context: string) => {
    setIsOpen(false);
    setSearchTerm('');
    onRoleSelect?.(title, context);
  };

  return (
    <div data-testid="suggested-actions" className={isCompact ? "" : "w-full"}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          {isCompact ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs"
            >
              Change
              <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full justify-between text-left h-auto py-3 px-4"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Choose a role to get started...
                </span>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          )}
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className={isCompact ? "w-80 p-0" : "w-[var(--radix-dropdown-menu-trigger-width)] p-0"} 
          align={isCompact ? "end" : "start"}
        >
          <div className="p-2 border-b">
            <Input
              placeholder="Search roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-8"
              autoFocus
            />
          </div>
          
          <div className="max-h-[300px] overflow-y-auto">
            {filteredActions.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No roles found
              </div>
            ) : (
              filteredActions.map((suggestedAction, index) => (
                <motion.div
                  key={`suggested-action-${suggestedAction.title}-${index}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.02 * index }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer p-4 flex flex-col items-start gap-1"
                    onClick={() => handleRoleSelect(suggestedAction.title, suggestedAction.context)}
                  >
                    <span className="font-medium text-sm">
                      {suggestedAction.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {suggestedAction.label}
                    </span>
                  </DropdownMenuItem>
                </motion.div>
              ))
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
