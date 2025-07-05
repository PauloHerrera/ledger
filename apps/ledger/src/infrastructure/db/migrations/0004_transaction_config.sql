CREATE TYPE "public"."transaction_status" AS ENUM('active', 'inactive', 'deleted');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" text NOT NULL,
	"description" text,
	"ledger_id" uuid,
	"status" "transaction_status" DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transaction_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" uuid,
	"direction" "operation_tipe" NOT NULL,
	"amount_field" text NOT NULL,
	"transaction_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_ledger_id_ledger_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."ledger"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_entries" ADD CONSTRAINT "transaction_entries_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction_entries" ADD CONSTRAINT "transaction_entries_transaction_id_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "transactions_event_type_idx" ON "transactions" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "transaction_entries_account_id_idx" ON "transaction_entries" USING btree ("account_id");