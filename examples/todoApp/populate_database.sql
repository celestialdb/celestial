CREATE DATABASE shopping_cart;

-- connect to the database

-- Table Definition
CREATE TABLE "public"."color" (
    "code" int8 NOT NULL,
    "color" varchar NOT NULL,
    PRIMARY KEY ("code")
);

-- Table Definition
CREATE TABLE "public"."status" (
    "code" int8 NOT NULL,
    "status" varchar NOT NULL,
    PRIMARY KEY ("code")
);

-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS task_id_seq;

-- Table Definition
CREATE TABLE "public"."task" (
    "id" int4 NOT NULL DEFAULT nextval('task_id_seq'::regclass),
    "text" varchar NOT NULL,
    "color" int8,
    "status" int8 NOT NULL DEFAULT 3,
    PRIMARY KEY ("id")
);

INSERT INTO "public"."color" ("code", "color") VALUES
(1, 'red'),
(2, 'blue'),
(3, 'green'),
(4, 'yellow'),
(5, 'pink'),
(6, 'orange');

INSERT INTO "public"."status" ("code", "status") VALUES
(1, 'completed'),
(2, 'wip'),
(3, 'no status');

INSERT INTO "public"."task" ("id", "text", "color", "status") VALUES
(218, 'push changes to github', 1, 3),
(219, 'create todo app', 1, 1),
(220, 'test app functionalities', 3, 3),
(221, 'write readme', NULL, 3),
(222, 'clean up exports', NULL, 3),
(225, 'new', 2, 1);

ALTER TABLE "public"."task" ADD FOREIGN KEY ("status") REFERENCES "public"."status"("code");
ALTER TABLE "public"."task" ADD FOREIGN KEY ("color") REFERENCES "public"."color"("code");
