import { supabase } from './supabase';

export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const budgetsWithSpending = await Promise.all(
    (data || []).map(async (b: any) => {
      const { data: expenses } = await supabase
        .from('expenses')
        .select('amount, id')
        .eq('budget_id', b.id);
      const totalSpend = (expenses || []).reduce((s: number, e: any) => s + Number(e.amount), 0);
      return { ...b, totalSpend, totalItem: expenses?.length || 0 };
    })
  );

  return budgetsWithSpending;
}

export async function createBudget({ name, amount, icon, userId, parentId }: { name: string; amount: number | string; icon: string; userId: string; parentId?: string }) {
  const insert: any = { name, amount: Number(amount), icon: icon || '💰', user_id: userId };
  if (parentId) insert.parent_id = parentId;

  const { data, error } = await supabase.from('budgets').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateBudget(budgetId: string, updates: { name?: string; amount?: number | string; icon?: string }) {
  const update: any = {};
  if (updates.name !== undefined) update.name = updates.name;
  if (updates.amount !== undefined) update.amount = Number(updates.amount);
  if (updates.icon !== undefined) update.icon = updates.icon;

  const { data, error } = await supabase.from('budgets').update(update).eq('id', budgetId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteBudget(budgetId: string) {
  const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
  if (error) throw error;
}

export async function getBudgetDetail(budgetId: string) {
  const { data, error } = await supabase.from('budgets').select('*').eq('id', budgetId).single();
  if (error) throw error;
  return data;
}

export async function getExpenses(budgetId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('budget_id', budgetId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllExpenses(userId: string) {
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, name, icon')
    .eq('user_id', userId);

  if (!budgets || budgets.length === 0) return [];

  const budgetIds = budgets.map((b: any) => b.id);
  const budgetMap = new Map(budgets.map((b: any) => [b.id, b]));

  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .in('budget_id', budgetIds)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data || []).map((e: any) => ({ ...e, budgets: budgetMap.get(e.budget_id) || null }));
}

export async function addExpense({ name, amount, budgetId, expenseDate }: { name: string; amount: number | string; budgetId: string; expenseDate?: string }) {
  const insert: any = { name, amount: Number(amount), budget_id: budgetId };
  if (expenseDate) insert.expense_date = expenseDate;

  const { data, error } = await supabase.from('expenses').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function updateExpense(expenseId: string, updates: { name?: string; amount?: number | string; expenseDate?: string }) {
  const update: any = {};
  if (updates.name !== undefined) update.name = updates.name;
  if (updates.amount !== undefined) update.amount = Number(updates.amount);
  if (updates.expenseDate !== undefined) update.expense_date = updates.expenseDate;

  const { data, error } = await supabase.from('expenses').update(update).eq('id', expenseId).select().single();
  if (error) throw error;
  return data;
}

export async function deleteExpense(expenseId: string) {
  const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
  if (error) throw error;
}

export async function getBudgetSpending(budgetId: string) {
  const { data, error } = await supabase.from('expenses').select('amount').eq('budget_id', budgetId);
  if (error) throw error;
  return (data || []).reduce((sum: number, e: any) => sum + Number(e.amount), 0);
}
