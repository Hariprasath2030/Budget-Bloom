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

// ========== AUTO-TRACKING ==========

export async function getPendingAutoTransactions(userId: string) {
  const { data, error } = await supabase
    .from('auto_transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('detected_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllAutoTransactions(userId: string) {
  const { data, error } = await supabase
    .from('auto_transactions')
    .select('*')
    .eq('user_id', userId)
    .order('detected_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createAutoTransaction(tx: {
  userId: string; amount: number | string; merchantName?: string;
  category?: string; paymentMethod?: string; sourceApp?: string;
  rawNotification?: string; transactionDate?: string;
}) {
  const insert: any = {
    user_id: tx.userId,
    amount: Number(tx.amount),
  };
  if (tx.merchantName) insert.merchant_name = tx.merchantName;
  if (tx.category) insert.category = tx.category;
  if (tx.paymentMethod) insert.payment_method = tx.paymentMethod;
  if (tx.sourceApp) insert.source_app = tx.sourceApp;
  if (tx.rawNotification) insert.raw_notification = tx.rawNotification;
  if (tx.transactionDate) insert.transaction_date = tx.transactionDate;

  const { data, error } = await supabase.from('auto_transactions').insert(insert).select().single();
  if (error) throw error;
  return data;
}

export async function confirmAutoTransaction(
  autoTxId: string, budgetId: string, updates: { category?: string; amount?: number | string }
) {
  const update: any = { status: 'confirmed', budget_id: budgetId };
  if (updates.category) update.category = updates.category;
  if (updates.amount) update.amount = Number(updates.amount);

  const { data, error } = await supabase.from('auto_transactions').update(update).eq('id', autoTxId).select().single();
  if (error) throw error;

  // Also create the actual expense
  const expense: any = {
    name: data.merchant_name || 'Auto-detected expense',
    amount: Number(data.amount),
    budget_id: budgetId,
  };
  if (data.transaction_date) expense.expense_date = data.transaction_date;

  const { data: expenseData, error: expenseError } = await supabase.from('expenses').insert(expense).select().single();
  if (!expenseError && expenseData) {
    await supabase.from('auto_transactions').update({ expense_id: expenseData.id }).eq('id', autoTxId);
  }

  return data;
}

export async function dismissAutoTransaction(autoTxId: string) {
  const { data, error } = await supabase
    .from('auto_transactions')
    .update({ status: 'dismissed' })
    .eq('id', autoTxId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMerchantCategories() {
  const { data, error } = await supabase
    .from('merchant_categories')
    .select('*')
    .order('merchant_pattern', { ascending: true });
  if (error) throw error;
  return data;
}

export async function addMerchantCategory(pattern: string, category: string, icon: string, userId?: string) {
  const insert: any = { merchant_pattern: pattern.toLowerCase(), category, icon };
  if (userId) insert.user_id = userId;

  const { data, error } = await supabase.from('merchant_categories').insert(insert).select().single();
  if (error) throw error;
  return data;
}
