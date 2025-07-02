ALTER TABLE "journal" ADD COLUMN "ledger_id" uuid NOT NULL REFERENCES "public"."ledger"("id");
ALTER TABLE "journal" ALTER COLUMN "code" DROP DEFAULT;
ALTER TABLE "journal" ALTER COLUMN "code" TYPE integer;
ALTER TABLE "journal" ADD CONSTRAINT "journal_ledger_code_unique" UNIQUE ("ledger_id", "code");

CREATE OR REPLACE FUNCTION journal_next_code()
RETURNS TRIGGER AS $$
DECLARE
  next_code integer;
BEGIN
  SELECT COALESCE(MAX(code), 0) + 1
  INTO next_code
  FROM journal
  WHERE ledger_id = NEW.ledger_id
  FOR UPDATE;

  NEW.code := next_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER journal_code_trg
BEFORE INSERT ON journal
FOR EACH ROW
WHEN (NEW.code IS NULL)
EXECUTE FUNCTION journal_next_code();