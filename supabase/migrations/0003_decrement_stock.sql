-- Decrementa estoque atomicamente. Usado pelo webhook do MP quando pedido
-- vira "paid". A clausula greatest(...,0) protege contra estoque negativo
-- (no caso de webhook duplicado escapar da idempotencia).

create or replace function public.decrement_product_stock(p_id uuid, p_qty int)
returns int
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  new_qty int;
begin
  update public.products
     set stock_quantity = greatest(stock_quantity - p_qty, 0),
         updated_at = now()
   where id = p_id
   returning stock_quantity into new_qty;
  return new_qty;
end;
$$;

-- Permite chamar via service_role (admin client do webhook)
revoke all on function public.decrement_product_stock(uuid, int) from public;
grant execute on function public.decrement_product_stock(uuid, int) to service_role;
