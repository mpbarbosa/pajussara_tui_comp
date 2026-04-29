/**
 * @fileoverview ErrorDetailPanel — error/stack trace modal overlay
 * @module components/ErrorDetailPanel
 *
 * Displays the failed step name, error message, and a truncated stack trace.
 * This is adapted from ai_workflow.js so it can be reused as a generic
 * terminal error/details panel within pajussara_tui_comp.
 *
 * @version 1.4.0
 * @since 2026-04-29
 */
import React from 'react';
export interface ErrorDetailPanelError {
    stepId: string;
    stepName: string;
    message: string;
    stack: string | null;
}
export interface ErrorDetailPanelProps {
    error: ErrorDetailPanelError | null;
    onClose: () => void;
}
export declare function ErrorDetailPanel({ error, onClose, }: ErrorDetailPanelProps): React.ReactElement;
export default ErrorDetailPanel;
//# sourceMappingURL=ErrorDetailPanel.d.ts.map