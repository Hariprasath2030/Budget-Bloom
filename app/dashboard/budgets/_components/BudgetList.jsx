"use client";
import React, { useEffect, useState } from "react";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useUser } from "@clerk/nextjs";
import { db } from "../../../../utils/dbConfig";
import { Budgets, Expenses } from "../../../../utils/schema";
import CreateBudget from "./CreateBudget";
import BudgetItem from "./BudgetItem";

export default function BudgetList() {
  const [budgetList, setBudgetList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    if (user) getBudgetList();
  }, [user]);

  const getBudgetList = async () => {
    const result = await db
      .select({
        ...getTableColumns(Budgets),
        totalSpend: sql`sum(${Expenses.amount})`.mapWith(Number),
        totalItem: sql`count(${Expenses.id})`.mapWith(Number),
      })
      .from(Budgets)
      .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
      .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
      .groupBy(Budgets.id)
      .orderBy(desc(Budgets.id));

    const parents = result.filter((b) => !b.parentId);
    const children = result.filter((b) => b.parentId);

    const structured = parents.map((p) => ({
      ...p,
      children: children.filter((c) => c.parentId === p.id),
    }));

    setBudgetList(structured);
  };

  return (
    <div className="mt-9">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <CreateBudget
          refreshData={getBudgetList}
          parentOptions={budgetList.map((b) => ({ id: b.id, name: b.name }))}
        />
        {budgetList.length > 0
          ? budgetList.map((parent) => (
              <div
                key={parent.id}
                className="p-4 border rounded-lg bg-white shadow-md"
              >
                <BudgetItem budget={parent} />
                {parent.children.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-blue-200 space-y-3 ">
                    {parent.children.map((child) => (
                      <BudgetItem key={child.id} budget={child} />
                    ))}
                  </div>
                )}
              </div>
            ))
          : [1, 2, 3, 4, 5].map((_, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-bounce'"
              >
                <p className="text-center mt-17 text-black animate-bounce">
                  No budget found
                </p>
              </div>
            ))}
      </div>
    </div>
  );
}
