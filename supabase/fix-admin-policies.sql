-- The absolute most reliable way to check for Admin status in Supabase without causing infinite RLS recursion
-- is to create a secure stored function that bypasses Row Level Security.

-- 1. Create a function that reads the profile bypassing RLS
create or replace function public.is_admin()
returns boolean as $$
declare
  user_role text;
begin
  select role into user_role from public.profiles where id = auth.uid() limit 1;
  return coalesce(user_role = 'admin', false);
end;
$$ language plpgsql security definer;

-- 2. Drop the old recursive policies
drop policy if exists "Admins can view all profiles" on public.profiles;
drop policy if exists "Admins can manage products" on public.products;
drop policy if exists "Admins can manage categories" on public.categories;
drop policy if exists "Admins can manage inventory" on public.inventory;
drop policy if exists "Admins can manage all orders" on public.orders;
drop policy if exists "Admins can manage order items" on public.order_items;

-- 3. Apply the new clean policies using the security definer function
create policy "Admins can view all profiles" on public.profiles
  for all using (public.is_admin());

create policy "Admins can manage products" on public.products
  for all using (public.is_admin());

create policy "Admins can manage categories" on public.categories
  for all using (public.is_admin());

create policy "Admins can manage inventory" on public.inventory
  for all using (public.is_admin());

create policy "Admins can manage all orders" on public.orders
  for all using (public.is_admin());

create policy "Admins can manage order items" on public.order_items
  for all using (public.is_admin());
