import * as React from 'react';
export function Card({ className = '', ...props }: any) { return <div className={`rounded-xl border ${className}`} {...props} /> }
export function CardHeader({ className = '', ...props }: any) { return <div className={`p-4 border-b border-zinc-800/60 ${className}`} {...props} /> }
export function CardTitle({ className = '', ...props }: any) { return <div className={`text-lg font-semibold ${className}`} {...props} /> }
export function CardDescription({ className = '', ...props }: any) { return <div className={`text-sm text-zinc-400 ${className}`} {...props} /> }
export function CardContent({ className = '', ...props }: any) { return <div className={`p-4 ${className}`} {...props} /> }
export function CardFooter({ className = '', ...props }: any) { return <div className={`p-4 border-t border-zinc-800/60 ${className}`} {...props} /> }
