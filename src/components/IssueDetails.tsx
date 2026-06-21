"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock, User, Filter, MessageSquare, Send, Loader2 } from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export default function IssueDetailsPage({ isAdmin }: { isAdmin: boolean }) {
  const { id } = useParams();
  const [issue, setIssue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const fetchIssue = async () => {
    try {
      const res = await fetch(`/api/issues/${id}`);
      if (!res.ok) {
        router.push(isAdmin ? "/admin" : "/resident");
        return;
      }
      const data = await res.json();
      setIssue(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/issues/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchIssue();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await fetch(`/api/issues/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent }),
      });
      if (res.ok) {
        const newComment = await res.json();
        setIssue({
          ...issue,
          comments: [newComment, ...(issue.comments || [])],
        });
        setCommentContent("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12 text-gray-500">Loading issue details...</div>;
  }

  if (!issue) return null;

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link 
        href={isAdmin ? "/admin" : "/resident"} 
        className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to issues
      </Link>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-start">
          <div>
            <h3 className="text-2xl leading-6 font-bold text-gray-900">{issue.title}</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Filter className="h-4 w-4" /> {issue.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {new Date(issue.createdAt).toLocaleString()}
              </span>
              {isAdmin && (
                <span className="flex items-center gap-1 font-medium text-blue-600">
                  <User className="h-4 w-4" /> {issue.resident?.name}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={cn(
              "px-3 py-1 rounded-full text-sm font-semibold",
              statusColors[issue.status as keyof typeof statusColors]
            )}>
              {issue.status}
            </span>
            
            {isAdmin && (
              <select
                disabled={updatingStatus}
                value={issue.status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                className="mt-2 block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md border"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In-Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <p className="text-gray-700 whitespace-pre-wrap">{issue.description}</p>
        </div>
      </div>

      <div className="bg-white shadow sm:rounded-lg p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Updates & Comments
        </h4>

        <form onSubmit={handleCommentSubmit} className="mb-8">
          <div className="flex gap-2">
            <textarea
              rows={2}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Add a comment or update..."
              className="block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 rounded-md p-2 border"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentContent.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {submittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {issue.comments?.length === 0 ? (
            <p className="text-center text-gray-500 py-4 italic text-sm">No comments yet.</p>
          ) : (
            issue.comments?.map((comment: any) => (
              <div key={comment.id} className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-bold text-gray-900">{comment.user?.name}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
