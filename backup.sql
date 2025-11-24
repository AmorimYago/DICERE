--
-- PostgreSQL database dump
--

\restrict d3JqjhsE6LpolRgKLk0phuJcL0wM1JUP5hoWwHFGKd6z73b5aK0p2fRpShPgmTn

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Account; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Account" (
    id text NOT NULL,
    "userId" text NOT NULL,
    type text NOT NULL,
    provider text NOT NULL,
    "providerAccountId" text NOT NULL,
    refresh_token text,
    access_token text,
    expires_at integer,
    token_type text,
    scope text,
    id_token text,
    session_state text
);


ALTER TABLE public."Account" OWNER TO dicere_user;

--
-- Name: Category; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Category" (
    id text NOT NULL,
    name text NOT NULL,
    "displayName" text NOT NULL,
    icon text,
    color text NOT NULL,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "createdBy" text,
    description text,
    "isCustom" boolean DEFAULT false NOT NULL,
    "imageUrl" text,
    "isActive" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Category" OWNER TO dicere_user;

--
-- Name: Child; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Child" (
    id text NOT NULL,
    name text NOT NULL,
    "birthDate" timestamp(3) without time zone,
    "profilePhoto" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    password text
);


ALTER TABLE public."Child" OWNER TO dicere_user;

--
-- Name: ChildAccess; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."ChildAccess" (
    id text NOT NULL,
    "userId" text NOT NULL,
    "childId" text NOT NULL,
    role text DEFAULT 'caregiver'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."ChildAccess" OWNER TO dicere_user;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Comment" (
    id text NOT NULL,
    "sequenceId" text NOT NULL,
    "userId" text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO dicere_user;

--
-- Name: Image; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Image" (
    id text NOT NULL,
    name text NOT NULL,
    "imageUrl" text,
    "audioUrl" text,
    "categoryId" text NOT NULL,
    "isCustom" boolean DEFAULT false NOT NULL,
    "uploadedBy" text,
    "order" integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Image" OWNER TO dicere_user;

--
-- Name: Report; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Report" (
    id text NOT NULL,
    "childId" text NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "totalSequences" integer DEFAULT 0 NOT NULL,
    "totalImages" integer DEFAULT 0 NOT NULL,
    "mostUsedWords" text[] DEFAULT ARRAY[]::text[],
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Report" OWNER TO dicere_user;

--
-- Name: Sequence; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Sequence" (
    id text NOT NULL,
    "childId" text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Sequence" OWNER TO dicere_user;

--
-- Name: SequenceItem; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."SequenceItem" (
    id text NOT NULL,
    "sequenceId" text NOT NULL,
    "imageId" text NOT NULL,
    "order" integer NOT NULL
);


ALTER TABLE public."SequenceItem" OWNER TO dicere_user;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Session" OWNER TO dicere_user;

--
-- Name: User; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    role text DEFAULT 'PAI'::text NOT NULL,
    "parentId" text,
    "childProfile" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO dicere_user;

--
-- Name: VerificationToken; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public."VerificationToken" (
    identifier text NOT NULL,
    token text NOT NULL,
    expires timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VerificationToken" OWNER TO dicere_user;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: dicere_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO dicere_user;

--
-- Data for Name: Account; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Account" (id, "userId", type, provider, "providerAccountId", refresh_token, access_token, expires_at, token_type, scope, id_token, session_state) FROM stdin;
\.


--
-- Data for Name: Category; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Category" (id, name, "displayName", icon, color, "order", "createdAt", "updatedAt", "createdBy", description, "isCustom", "imageUrl", "isActive") FROM stdin;
cmib9khpw0000c8w4z1ci4tne	geral	Geral	💬	#E3F2FD	1	2025-11-23 05:14:52.725	2025-11-23 05:14:52.725	\N	\N	f	https://api.arasaac.org/api/pictograms/6632?download=false	t
cmib9kj8b0011c8w4e1h3vqce	comida	Comida	🍎	#FFF3E0	2	2025-11-23 05:14:54.684	2025-11-23 05:14:54.684	\N	\N	f	https://api.arasaac.org/api/pictograms/4611?download=false	t
cmib9kl96002ec8w4c1f7hlre	bebidas	Bebidas	☕	#E8F5E9	3	2025-11-23 05:14:57.307	2025-11-23 05:14:57.307	\N	\N	f	https://api.arasaac.org/api/pictograms/30403?download=false	t
cmib9km0g002xc8w4o1mq5vge	sentimentos	Sentimentos	😊	#FFF9C4	4	2025-11-23 05:14:58.288	2025-11-23 05:14:58.288	\N	\N	f	https://api.arasaac.org/api/pictograms/11476?download=false	t
cmib9kn0u003mc8w426nkixwc	saude	Saúde	❤️	#FFEBEE	5	2025-11-23 05:14:59.599	2025-11-23 05:14:59.599	\N	\N	f	https://api.arasaac.org/api/pictograms/14264?download=false	t
cmib9kojk004nc8w458ihnxp0	objetos	Objetos	📱	#F3E5F5	6	2025-11-23 05:15:01.568	2025-11-23 05:15:01.568	\N	\N	f	https://api.arasaac.org/api/pictograms/11318?download=false	t
cmib9kpk5005cc8w4oqmu4pek	lugares	Lugares	📍	#E0F2F1	7	2025-11-23 05:15:02.885	2025-11-23 05:15:02.885	\N	\N	f	https://api.arasaac.org/api/pictograms/24161?download=false	t
cmib9kqee005xc8w4p3swi5xe	roupas	Roupas	👕	#FCE4EC	8	2025-11-23 05:15:03.974	2025-11-23 05:15:03.974	\N	\N	f	https://api.arasaac.org/api/pictograms/7233?download=false	t
cmib9krwv006yc8w446h51kjg	cores	Cores	🎨	#E1F5FE	9	2025-11-23 05:15:05.936	2025-11-23 05:15:05.936	\N	\N	f	https://api.arasaac.org/api/pictograms/5968?download=false	t
cmib9ksi4007dc8w4mimn63i2	numeros	Números	🔢	#FFF8E1	10	2025-11-23 05:15:06.701	2025-11-23 05:15:06.701	\N	\N	f	https://api.arasaac.org/api/pictograms/2879?download=false	t
cmib9ktfg0080c8w4b0j5deha	alfabeto	Alfabeto	🔤	#F1F8E9	11	2025-11-23 05:15:07.9	2025-11-23 05:15:07.9	\N	\N	f	https://api.arasaac.org/api/pictograms/3050?download=false	t
cmib9kwmg00a5c8w42x59igcd	formas	Formas	⬜	#EFEBE9	12	2025-11-23 05:15:12.04	2025-11-23 05:15:12.04	\N	\N	f	https://api.arasaac.org/api/pictograms/4651?download=false	t
cmib9kxvu00b0c8w42w9ekfzh	diversao	Diversão	🎮	#E8EAF6	13	2025-11-23 05:15:13.674	2025-11-23 05:15:13.674	\N	\N	f	https://api.arasaac.org/api/pictograms/37464?download=false	t
\.


--
-- Data for Name: Child; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Child" (id, name, "birthDate", "profilePhoto", notes, "createdAt", "updatedAt", password) FROM stdin;
cmic008dl0000c8bgr6lrljqm	Enzo Amorim	2015-11-30 00:00:00	\N	\N	2025-11-23 17:34:57.13	2025-11-23 17:34:57.13	$2a$10$Ibe/ewujP8FDltDjiWzocuL.JNv8bRw6GH/8IDrhnep/ZzrmGdOYG
\.


--
-- Data for Name: ChildAccess; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."ChildAccess" (id, "userId", "childId", role, "createdAt") FROM stdin;
cmic008dp0002c8bgewh6neh8	cmibw6h0g0005c8fs17d6f29b	cmic008dl0000c8bgr6lrljqm	caregiver	2025-11-23 17:34:57.134
\.


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Comment" (id, "sequenceId", "userId", content, "createdAt", "updatedAt") FROM stdin;
cmic6z0h90004c8jskyjmf1qa	cmic2gxbf000hc894i5hi6j52	cmibw6h0g0005c8fs17d6f29b	Preto	2025-11-23 20:49:57.549	2025-11-23 20:49:57.549
\.


--
-- Data for Name: Image; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Image" (id, name, "imageUrl", "audioUrl", "categoryId", "isCustom", "uploadedBy", "order", "isActive", "createdAt", "updatedAt") FROM stdin;
cmib9khq00002c8w47wmnnmvf	Eu	https://api.arasaac.org/api/pictograms/6632?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	1	t	2025-11-23 05:14:52.728	2025-11-23 05:14:52.728
cmib9khsw0004c8w4fqcxixhe	Sim	https://api.arasaac.org/api/pictograms/5584?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	2	t	2025-11-23 05:14:52.832	2025-11-23 05:14:52.832
cmib9khvy0006c8w4dlbmo1o9	Não	https://api.arasaac.org/api/pictograms/5526?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	3	t	2025-11-23 05:14:52.942	2025-11-23 05:14:52.942
cmib9khz00008c8w4sl5yrnad	Quero	https://api.arasaac.org/api/pictograms/5441?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	4	t	2025-11-23 05:14:53.052	2025-11-23 05:14:53.052
cmib9ki1z000ac8w4hucah8uq	Não quero	https://api.arasaac.org/api/pictograms/6156?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	5	t	2025-11-23 05:14:53.16	2025-11-23 05:14:53.16
cmib9ki50000cc8w4fdjrg00v	Quero mais	https://api.arasaac.org/api/pictograms/32753?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	6	t	2025-11-23 05:14:53.269	2025-11-23 05:14:53.269
cmib9ki82000ec8w4hw224nhr	Ser	https://api.arasaac.org/api/pictograms/36480?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	7	t	2025-11-23 05:14:53.378	2025-11-23 05:14:53.378
cmib9kib2000gc8w408b2ut7j	Ir	https://api.arasaac.org/api/pictograms/8142?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	8	t	2025-11-23 05:14:53.487	2025-11-23 05:14:53.487
cmib9kie2000ic8w4fj9w1vyh	Ver	https://api.arasaac.org/api/pictograms/6564?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	9	t	2025-11-23 05:14:53.594	2025-11-23 05:14:53.594
cmib9kih2000kc8w4s62u01l9	Ouvir	https://api.arasaac.org/api/pictograms/6572?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	10	t	2025-11-23 05:14:53.702	2025-11-23 05:14:53.702
cmib9kik4000mc8w4jxhatiu5	Por favor	https://api.arasaac.org/api/pictograms/8195?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	11	t	2025-11-23 05:14:53.812	2025-11-23 05:14:53.812
cmib9kin5000oc8w4zadivk3e	Obrigado	https://api.arasaac.org/api/pictograms/8129?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	12	t	2025-11-23 05:14:53.921	2025-11-23 05:14:53.921
cmib9kiq5000qc8w4ld1zq10q	Desculpa	https://api.arasaac.org/api/pictograms/38361?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	13	t	2025-11-23 05:14:54.03	2025-11-23 05:14:54.03
cmib9kit7000sc8w4r9q8criy	Ajuda	https://api.arasaac.org/api/pictograms/12252?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	14	t	2025-11-23 05:14:54.14	2025-11-23 05:14:54.14
cmib9kiw8000uc8w47fjeqy5u	Oi	https://api.arasaac.org/api/pictograms/6522?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	15	t	2025-11-23 05:14:54.248	2025-11-23 05:14:54.248
cmib9kiz7000wc8w4tkex33lj	Até logo	https://api.arasaac.org/api/pictograms/6028?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	16	t	2025-11-23 05:14:54.355	2025-11-23 05:14:54.355
cmib9kj28000yc8w4njd5w9ne	Ok	https://api.arasaac.org/api/pictograms/31410?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	17	t	2025-11-23 05:14:54.465	2025-11-23 05:14:54.465
cmib9kj590010c8w4lakkupkg	Buscar	https://api.arasaac.org/api/pictograms/27391?download=false	\N	cmib9khpw0000c8w4z1ci4tne	f	\N	18	t	2025-11-23 05:14:54.573	2025-11-23 05:14:54.573
cmib9kj8e0013c8w4oezzcw79	Comer	https://api.arasaac.org/api/pictograms/38413?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	1	t	2025-11-23 05:14:54.686	2025-11-23 05:14:54.686
cmib9kjbc0015c8w4fnfn5tnv	Maçã	https://api.arasaac.org/api/pictograms/2462?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	2	t	2025-11-23 05:14:54.792	2025-11-23 05:14:54.792
cmib9kjee0017c8w40ktpowgl	Banana	https://api.arasaac.org/api/pictograms/9054?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	3	t	2025-11-23 05:14:54.903	2025-11-23 05:14:54.903
cmib9kjhh0019c8w4wjcbbs6q	Uva	https://api.arasaac.org/api/pictograms/34120?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	4	t	2025-11-23 05:14:55.013	2025-11-23 05:14:55.013
cmib9kjkj001bc8w4y5kyk8n7	Pão	https://api.arasaac.org/api/pictograms/2494?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	5	t	2025-11-23 05:14:55.123	2025-11-23 05:14:55.123
cmib9kjnj001dc8w4nudwk9mb	Manteiga	https://api.arasaac.org/api/pictograms/2461?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	6	t	2025-11-23 05:14:55.231	2025-11-23 05:14:55.231
cmib9kjqk001fc8w4uh97t13y	Presunto	https://api.arasaac.org/api/pictograms/2963?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	7	t	2025-11-23 05:14:55.34	2025-11-23 05:14:55.34
cmib9kjtk001hc8w48klvce6o	Queijo	https://api.arasaac.org/api/pictograms/2541?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	8	t	2025-11-23 05:14:55.449	2025-11-23 05:14:55.449
cmib9kjwk001jc8w4ygw9q0mh	Bolo	https://api.arasaac.org/api/pictograms/29226?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	9	t	2025-11-23 05:14:55.557	2025-11-23 05:14:55.557
cmib9kjzm001lc8w4viul9flm	Biscoito	https://api.arasaac.org/api/pictograms/38649?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	10	t	2025-11-23 05:14:55.667	2025-11-23 05:14:55.667
cmib9kk2m001nc8w4jen75ds3	Biscoito de chocolate	https://api.arasaac.org/api/pictograms/6525?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	11	t	2025-11-23 05:14:55.774	2025-11-23 05:14:55.774
cmib9kk5n001pc8w4ljxlcfdz	Chocolate	https://api.arasaac.org/api/pictograms/25940?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	12	t	2025-11-23 05:14:55.884	2025-11-23 05:14:55.884
cmib9kk8p001rc8w4ffg4ucch	Sorvete	https://api.arasaac.org/api/pictograms/35209?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	13	t	2025-11-23 05:14:55.994	2025-11-23 05:14:55.994
cmib9kkbq001tc8w40llwt2y5	Espaguete	https://api.arasaac.org/api/pictograms/2383?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	14	t	2025-11-23 05:14:56.103	2025-11-23 05:14:56.103
cmib9kkeq001vc8w4swfo83op	Pizza	https://api.arasaac.org/api/pictograms/2527?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	15	t	2025-11-23 05:14:56.21	2025-11-23 05:14:56.21
cmib9kkhs001xc8w4rszm2y3v	Hambúrguer	https://api.arasaac.org/api/pictograms/2419?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	16	t	2025-11-23 05:14:56.32	2025-11-23 05:14:56.32
cmib9kkku001zc8w4ng6bflu1	Batata frita	https://api.arasaac.org/api/pictograms/8653?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	17	t	2025-11-23 05:14:56.43	2025-11-23 05:14:56.43
cmib9kknx0021c8w4gqydkihp	Sopa	https://api.arasaac.org/api/pictograms/35355?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	18	t	2025-11-23 05:14:56.541	2025-11-23 05:14:56.541
cmib9kkqy0023c8w4xnxyjeam	Iogurte	https://api.arasaac.org/api/pictograms/2618?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	19	t	2025-11-23 05:14:56.65	2025-11-23 05:14:56.65
cmib9kktz0025c8w4mvb94ri9	Doce	https://api.arasaac.org/api/pictograms/22182?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	20	t	2025-11-23 05:14:56.76	2025-11-23 05:14:56.76
cmib9kkx10027c8w4s4aayp3p	Arroz	https://api.arasaac.org/api/pictograms/39387?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	21	t	2025-11-23 05:14:56.869	2025-11-23 05:14:56.869
cmib9kl030029c8w4rzq2gxxv	Feijão	https://api.arasaac.org/api/pictograms/3294?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	22	t	2025-11-23 05:14:56.979	2025-11-23 05:14:56.979
cmib9kl34002bc8w4wzz9clhs	Salada	https://api.arasaac.org/api/pictograms/2377?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	23	t	2025-11-23 05:14:57.089	2025-11-23 05:14:57.089
cmib9kl64002dc8w4akmna7s2	Pão de forma	https://api.arasaac.org/api/pictograms/2865?download=false	\N	cmib9kj8b0011c8w4e1h3vqce	f	\N	24	t	2025-11-23 05:14:57.197	2025-11-23 05:14:57.197
cmib9kl98002gc8w4gf2icz0f	Beber	https://api.arasaac.org/api/pictograms/6061?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	1	t	2025-11-23 05:14:57.309	2025-11-23 05:14:57.309
cmib9klc7002ic8w45elwxwzw	Água	https://api.arasaac.org/api/pictograms/2248?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	2	t	2025-11-23 05:14:57.416	2025-11-23 05:14:57.416
cmib9klf7002kc8w4r89g7x1p	Suco de laranja	https://api.arasaac.org/api/pictograms/2624?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	3	t	2025-11-23 05:14:57.524	2025-11-23 05:14:57.524
cmib9kli8002mc8w4afzhyfav	Leite	https://api.arasaac.org/api/pictograms/2445?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	4	t	2025-11-23 05:14:57.633	2025-11-23 05:14:57.633
cmib9kllb002oc8w48o2q9gbk	Achocolatado	https://api.arasaac.org/api/pictograms/4940?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	5	t	2025-11-23 05:14:57.744	2025-11-23 05:14:57.744
cmib9klod002qc8w4o5wdhr9o	Vitamina de frutas	https://api.arasaac.org/api/pictograms/32368?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	6	t	2025-11-23 05:14:57.853	2025-11-23 05:14:57.853
cmib9klrd002sc8w4oqzzrfri	Café	https://api.arasaac.org/api/pictograms/2296?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	7	t	2025-11-23 05:14:57.961	2025-11-23 05:14:57.961
cmib9klue002uc8w48vipye5r	Chá	https://api.arasaac.org/api/pictograms/29802?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	8	t	2025-11-23 05:14:58.071	2025-11-23 05:14:58.071
cmib9klxf002wc8w4o4bghaok	Coca-cola	https://api.arasaac.org/api/pictograms/2338?download=false	\N	cmib9kl96002ec8w4c1f7hlre	f	\N	9	t	2025-11-23 05:14:58.18	2025-11-23 05:14:58.18
cmib9km0i002zc8w46pyjsepc	Feliz	https://api.arasaac.org/api/pictograms/6892?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	1	t	2025-11-23 05:14:58.291	2025-11-23 05:14:58.291
cmib9km3h0031c8w4k1zp7h6f	Engraçado	https://api.arasaac.org/api/pictograms/35555?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	2	t	2025-11-23 05:14:58.397	2025-11-23 05:14:58.397
cmib9km6j0033c8w40p0pag2y	Amoroso	https://api.arasaac.org/api/pictograms/37799?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	3	t	2025-11-23 05:14:58.507	2025-11-23 05:14:58.507
cmib9km9k0035c8w41n2c9s0x	Apaixonado	https://api.arasaac.org/api/pictograms/30389?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	4	t	2025-11-23 05:14:58.617	2025-11-23 05:14:58.617
cmib9kmcl0037c8w433l9wwkb	Confuso	https://api.arasaac.org/api/pictograms/35541?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	5	t	2025-11-23 05:14:58.725	2025-11-23 05:14:58.725
cmib9kmfm0039c8w4oyuij0qs	Chateado	https://api.arasaac.org/api/pictograms/35531?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	6	t	2025-11-23 05:14:58.834	2025-11-23 05:14:58.834
cmib9kmio003bc8w4c86yw5n1	Triste	https://api.arasaac.org/api/pictograms/35545?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	7	t	2025-11-23 05:14:58.944	2025-11-23 05:14:58.944
cmib9kmlp003dc8w4iwcamixa	Irritado	https://api.arasaac.org/api/pictograms/35539?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	8	t	2025-11-23 05:14:59.053	2025-11-23 05:14:59.053
cmib9kmoq003fc8w4e34qebw9	Doente	https://api.arasaac.org/api/pictograms/8558?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	9	t	2025-11-23 05:14:59.162	2025-11-23 05:14:59.162
cmib9kmrq003hc8w4qe11qqxh	Bom	https://api.arasaac.org/api/pictograms/5397?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	10	t	2025-11-23 05:14:59.27	2025-11-23 05:14:59.27
cmib9kmur003jc8w4e91vi0ew	Ruim	https://api.arasaac.org/api/pictograms/5504?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	11	t	2025-11-23 05:14:59.379	2025-11-23 05:14:59.379
cmib9kmxt003lc8w40qttodya	Com sono	https://api.arasaac.org/api/pictograms/6479?download=false	\N	cmib9km0g002xc8w4o1mq5vge	f	\N	12	t	2025-11-23 05:14:59.489	2025-11-23 05:14:59.489
cmib9kn0x003oc8w4ul0qnbun	Calor	https://api.arasaac.org/api/pictograms/35561?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	1	t	2025-11-23 05:14:59.601	2025-11-23 05:14:59.601
cmib9kn3w003qc8w4wlcnfu11	Frio	https://api.arasaac.org/api/pictograms/35557?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	2	t	2025-11-23 05:14:59.708	2025-11-23 05:14:59.708
cmib9kn6y003sc8w4x33pbxlc	Dor	https://api.arasaac.org/api/pictograms/2367?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	3	t	2025-11-23 05:14:59.818	2025-11-23 05:14:59.818
cmib9kn9z003uc8w4yr64ce10	Dor de cabeça	https://api.arasaac.org/api/pictograms/28753?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	4	t	2025-11-23 05:14:59.927	2025-11-23 05:14:59.927
cmib9knd3003wc8w4neb15rmn	Dor de dente	https://api.arasaac.org/api/pictograms/10263?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	5	t	2025-11-23 05:15:00.039	2025-11-23 05:15:00.039
cmib9kng2003yc8w4i9op3twb	Dor de barriga	https://api.arasaac.org/api/pictograms/10264?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	6	t	2025-11-23 05:15:00.147	2025-11-23 05:15:00.147
cmib9knj60040c8w4kbtbeybj	Dor nas costas	https://api.arasaac.org/api/pictograms/7775?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	7	t	2025-11-23 05:15:00.258	2025-11-23 05:15:00.258
cmib9knm60042c8w4jf5k9hzw	Dor de garganta	https://api.arasaac.org/api/pictograms/10262?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	8	t	2025-11-23 05:15:00.366	2025-11-23 05:15:00.366
cmib9knp70044c8w422xdwui8	Dor de ouvido	https://api.arasaac.org/api/pictograms/10265?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	9	t	2025-11-23 05:15:00.476	2025-11-23 05:15:00.476
cmib9kns80046c8w4orn6vvs8	Doente	https://api.arasaac.org/api/pictograms/8558?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	10	t	2025-11-23 05:15:00.585	2025-11-23 05:15:00.585
cmib9knv80048c8w4v2bqr1bz	Tosse	https://api.arasaac.org/api/pictograms/26508?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	11	t	2025-11-23 05:15:00.693	2025-11-23 05:15:00.693
cmib9kny8004ac8w48wcze49b	Alergia	https://api.arasaac.org/api/pictograms/31823?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	12	t	2025-11-23 05:15:00.801	2025-11-23 05:15:00.801
cmib9ko19004cc8w4oeet2cxr	Resfriado	https://api.arasaac.org/api/pictograms/5479?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	13	t	2025-11-23 05:15:00.91	2025-11-23 05:15:00.91
cmib9ko4c004ec8w4ifuf6d5b	Febre	https://api.arasaac.org/api/pictograms/32530?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	14	t	2025-11-23 05:15:01.02	2025-11-23 05:15:01.02
cmib9ko7e004gc8w4npof37s5	Sangue	https://api.arasaac.org/api/pictograms/2803?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	15	t	2025-11-23 05:15:01.131	2025-11-23 05:15:01.131
cmib9koaf004ic8w4052c6l60	Machucado	https://api.arasaac.org/api/pictograms/5484?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	16	t	2025-11-23 05:15:01.239	2025-11-23 05:15:01.239
cmib9kodh004kc8w4ekchqo4y	Queimadura	https://api.arasaac.org/api/pictograms/22064?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	17	t	2025-11-23 05:15:01.349	2025-11-23 05:15:01.349
cmib9kogi004mc8w4595unc5q	Diarreia	https://api.arasaac.org/api/pictograms/38314?download=false	\N	cmib9kn0u003mc8w426nkixwc	f	\N	18	t	2025-11-23 05:15:01.458	2025-11-23 05:15:01.458
cmib9kojp004pc8w47v0otfiu	Usar	https://api.arasaac.org/api/pictograms/15485?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	1	t	2025-11-23 05:15:01.573	2025-11-23 05:15:01.573
cmib9komz004rc8w4uhwk6doi	Celular	https://api.arasaac.org/api/pictograms/25269?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	2	t	2025-11-23 05:15:01.691	2025-11-23 05:15:01.691
cmib9koq0004tc8w42d1ijlxo	Tablet	https://api.arasaac.org/api/pictograms/29151?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	3	t	2025-11-23 05:15:01.8	2025-11-23 05:15:01.8
cmib9kosz004vc8w426tr708e	Notebook	https://api.arasaac.org/api/pictograms/7214?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	4	t	2025-11-23 05:15:01.908	2025-11-23 05:15:01.908
cmib9kow0004xc8w4o97knkrw	Óculos	https://api.arasaac.org/api/pictograms/3329?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	5	t	2025-11-23 05:15:02.016	2025-11-23 05:15:02.016
cmib9koyz004zc8w4gptqybab	Tabela de comunicação	https://api.arasaac.org/api/pictograms/31882?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	6	t	2025-11-23 05:15:02.123	2025-11-23 05:15:02.123
cmib9kp1z0051c8w4njqp0b6a	Fone de ouvido	https://api.arasaac.org/api/pictograms/11208?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	7	t	2025-11-23 05:15:02.232	2025-11-23 05:15:02.232
cmib9kp520053c8w4g2rc0ho9	Rádio	https://api.arasaac.org/api/pictograms/38211?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	8	t	2025-11-23 05:15:02.342	2025-11-23 05:15:02.342
cmib9kp810055c8w4ktiv7lki	Livro	https://api.arasaac.org/api/pictograms/2450?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	9	t	2025-11-23 05:15:02.45	2025-11-23 05:15:02.45
cmib9kpb30057c8w4rwuok3jj	Aparelho auditivo	https://api.arasaac.org/api/pictograms/5912?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	10	t	2025-11-23 05:15:02.56	2025-11-23 05:15:02.56
cmib9kpe60059c8w4wtd5i2fk	Muletas	https://api.arasaac.org/api/pictograms/6154?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	11	t	2025-11-23 05:15:02.67	2025-11-23 05:15:02.67
cmib9kph6005bc8w46ldtmzn2	Cadeira de rodas	https://api.arasaac.org/api/pictograms/6212?download=false	\N	cmib9kojk004nc8w458ihnxp0	f	\N	12	t	2025-11-23 05:15:02.778	2025-11-23 05:15:02.778
cmib9kpk9005ec8w4nveyf63k	Casa	https://api.arasaac.org/api/pictograms/2317?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	1	t	2025-11-23 05:15:02.889	2025-11-23 05:15:02.889
cmib9kpn6005gc8w493m2ysgw	Escola	https://api.arasaac.org/api/pictograms/3082?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	2	t	2025-11-23 05:15:02.994	2025-11-23 05:15:02.994
cmib9kpq7005ic8w49u4f1zkm	Trabalho	https://api.arasaac.org/api/pictograms/11457?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	3	t	2025-11-23 05:15:03.103	2025-11-23 05:15:03.103
cmib9kpt6005kc8w4arc3u36w	Supermercado	https://api.arasaac.org/api/pictograms/3389?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	4	t	2025-11-23 05:15:03.211	2025-11-23 05:15:03.211
cmib9kpw7005mc8w4vdoslj18	Banco	https://api.arasaac.org/api/pictograms/3062?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	5	t	2025-11-23 05:15:03.32	2025-11-23 05:15:03.32
cmib9kpz8005oc8w4lhau2g44	Hospital	https://api.arasaac.org/api/pictograms/37408?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	6	t	2025-11-23 05:15:03.429	2025-11-23 05:15:03.429
cmib9kq2a005qc8w42rciorag	Farmácia	https://api.arasaac.org/api/pictograms/34274?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	7	t	2025-11-23 05:15:03.539	2025-11-23 05:15:03.539
cmib9kq5b005sc8w4q9f90495	Loja	https://api.arasaac.org/api/pictograms/9116?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	8	t	2025-11-23 05:15:03.647	2025-11-23 05:15:03.647
cmib9kq8c005uc8w40ycodngl	Restaurante	https://api.arasaac.org/api/pictograms/35391?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	9	t	2025-11-23 05:15:03.757	2025-11-23 05:15:03.757
cmib9kqbd005wc8w4b1nm4eb1	Igreja	https://api.arasaac.org/api/pictograms/3118?download=false	\N	cmib9kpk5005cc8w4oqmu4pek	f	\N	10	t	2025-11-23 05:15:03.865	2025-11-23 05:15:03.865
cmib9kqeg005zc8w47suplk3y	Vestir	https://api.arasaac.org/api/pictograms/27052?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	1	t	2025-11-23 05:15:03.977	2025-11-23 05:15:03.977
cmib9kqhf0061c8w4xp93a646	Calça jeans	https://api.arasaac.org/api/pictograms/24222?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	2	t	2025-11-23 05:15:04.084	2025-11-23 05:15:04.084
cmib9kqkh0063c8w4xtg0ie8h	Calça	https://api.arasaac.org/api/pictograms/2565?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	3	t	2025-11-23 05:15:04.193	2025-11-23 05:15:04.193
cmib9kqni0065c8w46dj4uvo5	Camiseta	https://api.arasaac.org/api/pictograms/2309?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	4	t	2025-11-23 05:15:04.302	2025-11-23 05:15:04.302
cmib9kqqj0067c8w4iqisuiiq	Vestido	https://api.arasaac.org/api/pictograms/2613?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	5	t	2025-11-23 05:15:04.411	2025-11-23 05:15:04.411
cmib9kqtj0069c8w4dpyxqks3	Cueca	https://api.arasaac.org/api/pictograms/2303?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	6	t	2025-11-23 05:15:04.52	2025-11-23 05:15:04.52
cmib9kqwk006bc8w4jq0b32tu	Calcinha	https://api.arasaac.org/api/pictograms/2289?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	7	t	2025-11-23 05:15:04.628	2025-11-23 05:15:04.628
cmib9kqzm006dc8w4fkq7r9m1	Regata	https://api.arasaac.org/api/pictograms/2310?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	8	t	2025-11-23 05:15:04.739	2025-11-23 05:15:04.739
cmib9kr2m006fc8w4001ouorz	Saia	https://api.arasaac.org/api/pictograms/2391?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	9	t	2025-11-23 05:15:04.847	2025-11-23 05:15:04.847
cmib9kr5n006hc8w4fx9tcanm	Pijama	https://api.arasaac.org/api/pictograms/2522?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	10	t	2025-11-23 05:15:04.956	2025-11-23 05:15:04.956
cmib9kr8o006jc8w4xs5tb49l	Moletom	https://api.arasaac.org/api/pictograms/8701?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	11	t	2025-11-23 05:15:05.065	2025-11-23 05:15:05.065
cmib9krbp006lc8w4xt36xybw	Casaco	https://api.arasaac.org/api/pictograms/4872?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	12	t	2025-11-23 05:15:05.174	2025-11-23 05:15:05.174
cmib9kres006nc8w4d3sdzuoc	Capa de chuva	https://api.arasaac.org/api/pictograms/4927?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	13	t	2025-11-23 05:15:05.284	2025-11-23 05:15:05.284
cmib9krhr006pc8w4pjk352st	Meia	https://api.arasaac.org/api/pictograms/2298?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	14	t	2025-11-23 05:15:05.392	2025-11-23 05:15:05.392
cmib9krks006rc8w4qgagn2jf	Chinelo	https://api.arasaac.org/api/pictograms/8343?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	15	t	2025-11-23 05:15:05.5	2025-11-23 05:15:05.5
cmib9krns006tc8w47zby9ijj	Tênis	https://api.arasaac.org/api/pictograms/8332?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	16	t	2025-11-23 05:15:05.609	2025-11-23 05:15:05.609
cmib9krqt006vc8w41h46ggbs	Sandália	https://api.arasaac.org/api/pictograms/8368?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	17	t	2025-11-23 05:15:05.717	2025-11-23 05:15:05.717
cmib9krtt006xc8w4pzqxdx5b	Bota	https://api.arasaac.org/api/pictograms/36502?download=false	\N	cmib9kqee005xc8w4p3swi5xe	f	\N	18	t	2025-11-23 05:15:05.825	2025-11-23 05:15:05.825
cmib9krwy0070c8w4oljgs67b	Preto	https://api.arasaac.org/api/pictograms/2886?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	1	t	2025-11-23 05:15:05.938	2025-11-23 05:15:05.938
cmib9krzx0072c8w4xjh0nfq7	Azul	https://api.arasaac.org/api/pictograms/4869?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	2	t	2025-11-23 05:15:06.045	2025-11-23 05:15:06.045
cmib9ks2z0074c8w4n7jful3d	Vermelho	https://api.arasaac.org/api/pictograms/2808?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	3	t	2025-11-23 05:15:06.156	2025-11-23 05:15:06.156
cmib9ks610076c8w4szw08gd0	Branco	https://api.arasaac.org/api/pictograms/2662?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	4	t	2025-11-23 05:15:06.265	2025-11-23 05:15:06.265
cmib9ks910078c8w4lob3dbig	Verde	https://api.arasaac.org/api/pictograms/4887?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	5	t	2025-11-23 05:15:06.373	2025-11-23 05:15:06.373
cmib9ksc2007ac8w4pw75dwsa	Amarelo	https://api.arasaac.org/api/pictograms/2648?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	6	t	2025-11-23 05:15:06.483	2025-11-23 05:15:06.483
cmib9ksf3007cc8w4u71ky4ob	Rosa	https://api.arasaac.org/api/pictograms/2807?download=false	\N	cmib9krwv006yc8w446h51kjg	f	\N	7	t	2025-11-23 05:15:06.591	2025-11-23 05:15:06.591
cmib9ksi8007fc8w44elb28y8	0	https://api.arasaac.org/api/pictograms/6972?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	1	t	2025-11-23 05:15:06.705	2025-11-23 05:15:06.705
cmib9ksl6007hc8w4ilgt2xyl	1	https://api.arasaac.org/api/pictograms/7291?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	2	t	2025-11-23 05:15:06.81	2025-11-23 05:15:06.81
cmib9kso6007jc8w4lld3yzc0	2	https://api.arasaac.org/api/pictograms/7027?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	3	t	2025-11-23 05:15:06.919	2025-11-23 05:15:06.919
cmib9ksr6007lc8w4nz2mzly1	3	https://api.arasaac.org/api/pictograms/7283?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	4	t	2025-11-23 05:15:07.026	2025-11-23 05:15:07.026
cmib9ksu9007nc8w4hken6m8g	4	https://api.arasaac.org/api/pictograms/7005?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	5	t	2025-11-23 05:15:07.137	2025-11-23 05:15:07.137
cmib9ksxa007pc8w4nfzlfo87	5	https://api.arasaac.org/api/pictograms/6979?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	6	t	2025-11-23 05:15:07.246	2025-11-23 05:15:07.246
cmib9kt0b007rc8w4zxbml6ix	6	https://api.arasaac.org/api/pictograms/7241?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	7	t	2025-11-23 05:15:07.356	2025-11-23 05:15:07.356
cmib9kt3d007tc8w4upd2ltyn	7	https://api.arasaac.org/api/pictograms/7248?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	8	t	2025-11-23 05:15:07.466	2025-11-23 05:15:07.466
cmib9kt6e007vc8w4xnx2r36l	8	https://api.arasaac.org/api/pictograms/7189?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	9	t	2025-11-23 05:15:07.574	2025-11-23 05:15:07.574
cmib9kt9e007xc8w4jqs8hwi0	9	https://api.arasaac.org/api/pictograms/7188?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	10	t	2025-11-23 05:15:07.683	2025-11-23 05:15:07.683
cmib9ktcg007zc8w46f226qde	10	https://api.arasaac.org/api/pictograms/7025?download=false	\N	cmib9ksi4007dc8w4mimn63i2	f	\N	11	t	2025-11-23 05:15:07.792	2025-11-23 05:15:07.792
cmib9ktfi0082c8w42yswe2p7	A	https://api.arasaac.org/api/pictograms/3049?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	1	t	2025-11-23 05:15:07.903	2025-11-23 05:15:07.903
cmib9ktih0084c8w490j5bp10	B	https://api.arasaac.org/api/pictograms/3061?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	2	t	2025-11-23 05:15:08.01	2025-11-23 05:15:08.01
cmib9ktli0086c8w4grcvvwyw	C	https://api.arasaac.org/api/pictograms/3069?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	3	t	2025-11-23 05:15:08.118	2025-11-23 05:15:08.118
cmib9ktoj0088c8w42h06uuvn	D	https://api.arasaac.org/api/pictograms/3088?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	4	t	2025-11-23 05:15:08.228	2025-11-23 05:15:08.228
cmib9ktrm008ac8w47y848rko	E	https://api.arasaac.org/api/pictograms/3096?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	5	t	2025-11-23 05:15:08.339	2025-11-23 05:15:08.339
cmib9ktuo008cc8w43h66seni	F	https://api.arasaac.org/api/pictograms/3101?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	6	t	2025-11-23 05:15:08.448	2025-11-23 05:15:08.448
cmib9ktxo008ec8w4ub8y9017	G	https://api.arasaac.org/api/pictograms/3104?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	7	t	2025-11-23 05:15:08.556	2025-11-23 05:15:08.556
cmib9ku0o008gc8w4ishjowlv	H	https://api.arasaac.org/api/pictograms/3112?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	8	t	2025-11-23 05:15:08.665	2025-11-23 05:15:08.665
cmib9ku3q008ic8w4ftdcb4sm	I	https://api.arasaac.org/api/pictograms/3117?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	9	t	2025-11-23 05:15:08.774	2025-11-23 05:15:08.774
cmib9ku6q008kc8w4ggy2ujn2	J	https://api.arasaac.org/api/pictograms/3119?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	10	t	2025-11-23 05:15:08.883	2025-11-23 05:15:08.883
cmib9ku9r008mc8w4ebdewnnb	K	https://api.arasaac.org/api/pictograms/3120?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	11	t	2025-11-23 05:15:08.992	2025-11-23 05:15:08.992
cmib9kucr008oc8w4inq9f6t5	L	https://api.arasaac.org/api/pictograms/3121?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	12	t	2025-11-23 05:15:09.099	2025-11-23 05:15:09.099
cmib9kufs008qc8w4jausyf76	M	https://api.arasaac.org/api/pictograms/3125?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	13	t	2025-11-23 05:15:09.209	2025-11-23 05:15:09.209
cmib9kuis008sc8w4l9w8j8jm	N	https://api.arasaac.org/api/pictograms/3133?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	14	t	2025-11-23 05:15:09.316	2025-11-23 05:15:09.316
cmib9kult008uc8w4nt9j53oa	O	https://api.arasaac.org/api/pictograms/3136?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	15	t	2025-11-23 05:15:09.425	2025-11-23 05:15:09.425
cmib9kuou008wc8w4rq0edwjo	P	https://api.arasaac.org/api/pictograms/3137?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	16	t	2025-11-23 05:15:09.535	2025-11-23 05:15:09.535
cmib9kurv008yc8w4c02k23ic	Q	https://api.arasaac.org/api/pictograms/3146?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	17	t	2025-11-23 05:15:09.644	2025-11-23 05:15:09.644
cmib9kuux0090c8w4cfh631xq	R	https://api.arasaac.org/api/pictograms/3147?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	18	t	2025-11-23 05:15:09.753	2025-11-23 05:15:09.753
cmib9kuxx0092c8w48yy8bgx5	S	https://api.arasaac.org/api/pictograms/3152?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	19	t	2025-11-23 05:15:09.861	2025-11-23 05:15:09.861
cmib9kv0x0094c8w484dai682	T	https://api.arasaac.org/api/pictograms/3158?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	20	t	2025-11-23 05:15:09.969	2025-11-23 05:15:09.969
cmib9kv3y0096c8w43oyprmtj	U	https://api.arasaac.org/api/pictograms/3164?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	21	t	2025-11-23 05:15:10.078	2025-11-23 05:15:10.078
cmib9kv6z0098c8w4oifajcc6	V	https://api.arasaac.org/api/pictograms/3165?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	22	t	2025-11-23 05:15:10.188	2025-11-23 05:15:10.188
cmib9kva1009ac8w4sm8r1b19	W	https://api.arasaac.org/api/pictograms/3167?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	23	t	2025-11-23 05:15:10.298	2025-11-23 05:15:10.298
cmib9kvd3009cc8w4b6ccwu3y	X	https://api.arasaac.org/api/pictograms/3168?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	24	t	2025-11-23 05:15:10.407	2025-11-23 05:15:10.407
cmib9kvg3009ec8w4hie578r0	Y	https://api.arasaac.org/api/pictograms/3171?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	25	t	2025-11-23 05:15:10.516	2025-11-23 05:15:10.516
cmib9kvj4009gc8w4kehwfaes	Z	https://api.arasaac.org/api/pictograms/3173?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	26	t	2025-11-23 05:15:10.624	2025-11-23 05:15:10.624
cmib9kvm4009ic8w4i77jmlr7	Arroba	https://api.arasaac.org/api/pictograms/3177?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	27	t	2025-11-23 05:15:10.733	2025-11-23 05:15:10.733
cmib9kvp3009kc8w4rhs7s1l8	Vírgula	https://api.arasaac.org/api/pictograms/3189?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	28	t	2025-11-23 05:15:10.84	2025-11-23 05:15:10.84
cmib9kvs6009mc8w4byk7r8wq	Ponto	https://api.arasaac.org/api/pictograms/3218?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	29	t	2025-11-23 05:15:10.95	2025-11-23 05:15:10.95
cmib9kvv5009oc8w4a504bl7a	Ponto e vírigula	https://api.arasaac.org/api/pictograms/3422?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	30	t	2025-11-23 05:15:11.057	2025-11-23 05:15:11.057
cmib9kvy6009qc8w4w5z83ezk	Interrogação	https://api.arasaac.org/api/pictograms/3418?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	31	t	2025-11-23 05:15:11.167	2025-11-23 05:15:11.167
cmib9kw18009sc8w4hudqf89x	Exclamação	https://api.arasaac.org/api/pictograms/3417?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	32	t	2025-11-23 05:15:11.277	2025-11-23 05:15:11.277
cmib9kw49009uc8w4pxuzhnsa	Dois pontos	https://api.arasaac.org/api/pictograms/3420?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	33	t	2025-11-23 05:15:11.385	2025-11-23 05:15:11.385
cmib9kw78009wc8w4gvg6n851	Mais	https://api.arasaac.org/api/pictograms/3220?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	34	t	2025-11-23 05:15:11.493	2025-11-23 05:15:11.493
cmib9kwab009yc8w4fy4ul093	Menos	https://api.arasaac.org/api/pictograms/3200?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	35	t	2025-11-23 05:15:11.603	2025-11-23 05:15:11.603
cmib9kwdc00a0c8w42l0o4gr9	Asterisco	https://api.arasaac.org/api/pictograms/3178?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	36	t	2025-11-23 05:15:11.712	2025-11-23 05:15:11.712
cmib9kwgc00a2c8w4ti24di71	Aspas	https://api.arasaac.org/api/pictograms/3190?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	37	t	2025-11-23 05:15:11.82	2025-11-23 05:15:11.82
cmib9kwje00a4c8w4usybjz82	Barra	https://api.arasaac.org/api/pictograms/3413?download=false	\N	cmib9ktfg0080c8w4b0j5deha	f	\N	38	t	2025-11-23 05:15:11.931	2025-11-23 05:15:11.931
cmib9kwmi00a7c8w4th4zrst5	Círculo	https://api.arasaac.org/api/pictograms/4603?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	1	t	2025-11-23 05:15:12.042	2025-11-23 05:15:12.042
cmib9kwpj00a9c8w4bqdp85hi	Quadrado	https://api.arasaac.org/api/pictograms/4616?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	2	t	2025-11-23 05:15:12.151	2025-11-23 05:15:12.151
cmib9kwsh00abc8w4tf6lbylb	Retângulo	https://api.arasaac.org/api/pictograms/4731?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	3	t	2025-11-23 05:15:12.258	2025-11-23 05:15:12.258
cmib9kwvh00adc8w4452a9l1u	Losango	https://api.arasaac.org/api/pictograms/4734?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	4	t	2025-11-23 05:15:12.366	2025-11-23 05:15:12.366
cmib9kwyj00afc8w4ogmwdui0	Triângulo	https://api.arasaac.org/api/pictograms/4763?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	5	t	2025-11-23 05:15:12.475	2025-11-23 05:15:12.475
cmib9kx1k00ahc8w4kkfkcrz8	Pentágono	https://api.arasaac.org/api/pictograms/4715?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	6	t	2025-11-23 05:15:12.585	2025-11-23 05:15:12.585
cmib9kx4l00ajc8w4mvs6nd21	Hexágono	https://api.arasaac.org/api/pictograms/4663?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	7	t	2025-11-23 05:15:12.693	2025-11-23 05:15:12.693
cmib9kx7l00alc8w42otqpj6j	Estrela	https://api.arasaac.org/api/pictograms/4644?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	8	t	2025-11-23 05:15:12.801	2025-11-23 05:15:12.801
cmib9kxal00anc8w4s41484oq	Linha	https://api.arasaac.org/api/pictograms/4684?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	9	t	2025-11-23 05:15:12.909	2025-11-23 05:15:12.909
cmib9kxdm00apc8w4jdd8z7u7	Coração	https://api.arasaac.org/api/pictograms/4613?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	10	t	2025-11-23 05:15:13.018	2025-11-23 05:15:13.018
cmib9kxgm00arc8w4pomencmc	Pirâmide	https://api.arasaac.org/api/pictograms/9110?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	11	t	2025-11-23 05:15:13.127	2025-11-23 05:15:13.127
cmib9kxjn00atc8w44gxztvgx	Cilindro	https://api.arasaac.org/api/pictograms/9111?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	12	t	2025-11-23 05:15:13.235	2025-11-23 05:15:13.235
cmib9kxmo00avc8w4ioq81lr7	Cone	https://api.arasaac.org/api/pictograms/9112?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	13	t	2025-11-23 05:15:13.345	2025-11-23 05:15:13.345
cmib9kxpq00axc8w418a47gcz	Esfera	https://api.arasaac.org/api/pictograms/9113?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	14	t	2025-11-23 05:15:13.455	2025-11-23 05:15:13.455
cmib9kxsr00azc8w4812530qx	Cubo	https://api.arasaac.org/api/pictograms/9115?download=false	\N	cmib9kwmg00a5c8w42x59igcd	f	\N	15	t	2025-11-23 05:15:13.564	2025-11-23 05:15:13.564
cmib9kxvy00b2c8w4thwo5wu4	Cartas de baralho	https://api.arasaac.org/api/pictograms/3182?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	1	t	2025-11-23 05:15:13.678	2025-11-23 05:15:13.678
cmib9kxyw00b4c8w4exh4kftb	Brincar	https://api.arasaac.org/api/pictograms/23392?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	2	t	2025-11-23 05:15:13.784	2025-11-23 05:15:13.784
cmib9ky1x00b6c8w45n9syqr4	Videogame	https://api.arasaac.org/api/pictograms/10162?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	3	t	2025-11-23 05:15:13.893	2025-11-23 05:15:13.893
cmib9ky4y00b8c8w4psyw50t2	Bola	https://api.arasaac.org/api/pictograms/2269?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	4	t	2025-11-23 05:15:14.003	2025-11-23 05:15:14.003
cmib9ky8100bac8w47ao013aa	Blocos	https://api.arasaac.org/api/pictograms/8508?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	5	t	2025-11-23 05:15:14.113	2025-11-23 05:15:14.113
cmib9kyb000bcc8w4a58rkzsr	Lápis de cor	https://api.arasaac.org/api/pictograms/17016?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	6	t	2025-11-23 05:15:14.22	2025-11-23 05:15:14.22
cmib9kye100bec8w4goabnq32	Carro	https://api.arasaac.org/api/pictograms/6981?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	7	t	2025-11-23 05:15:14.329	2025-11-23 05:15:14.329
cmib9kyh200bgc8w4jqn3zpqa	Boneca	https://api.arasaac.org/api/pictograms/26238?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	8	t	2025-11-23 05:15:14.438	2025-11-23 05:15:14.438
cmib9kyk400bic8w4ibr5znw6	Amigos	https://api.arasaac.org/api/pictograms/2255?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	9	t	2025-11-23 05:15:14.548	2025-11-23 05:15:14.548
cmib9kyn600bkc8w4pk3rrwyy	Música	https://api.arasaac.org/api/pictograms/38041?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	10	t	2025-11-23 05:15:14.659	2025-11-23 05:15:14.659
cmib9kyq700bmc8w4ghof7elt	Televisão	https://api.arasaac.org/api/pictograms/16139?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	11	t	2025-11-23 05:15:14.767	2025-11-23 05:15:14.767
cmib9kyt700boc8w41t6zjr77	Filmes	https://api.arasaac.org/api/pictograms/36477?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	12	t	2025-11-23 05:15:14.876	2025-11-23 05:15:14.876
cmib9kyw800bqc8w4mq3optu8	Vídeos	https://api.arasaac.org/api/pictograms/38207?download=false	\N	cmib9kxvu00b0c8w42w9ekfzh	f	\N	13	t	2025-11-23 05:15:14.985	2025-11-23 05:15:14.985
\.


--
-- Data for Name: Report; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Report" (id, "childId", date, "totalSequences", "totalImages", "mostUsedWords", "generatedAt") FROM stdin;
\.


--
-- Data for Name: Sequence; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Sequence" (id, "childId", "timestamp") FROM stdin;
cmic13f5h0004c8bgmbfoj4e2	cmic008dl0000c8bgr6lrljqm	2025-11-23 18:05:25.493
cmic2geyi0001c8941kiwipy3	cmic008dl0000c8bgr6lrljqm	2025-11-23 18:43:31.387
cmic2gktj0007c894x5lvpm7c	cmic008dl0000c8bgr6lrljqm	2025-11-23 18:43:38.983
cmic2go18000dc89459k0grd3	cmic008dl0000c8bgr6lrljqm	2025-11-23 18:43:43.148
cmic2gxbf000hc894i5hi6j52	cmic008dl0000c8bgr6lrljqm	2025-11-23 18:43:55.178
cmic821mb0006c8jss6gkahx5	cmic008dl0000c8bgr6lrljqm	2025-11-23 21:20:18.611
cmic8c7sj0001c8fguzp0hq4n	cmic008dl0000c8bgr6lrljqm	2025-11-23 21:28:13.171
cmic8ikue0006c8fg396yyn4j	cmic008dl0000c8bgr6lrljqm	2025-11-23 21:33:10.022
\.


--
-- Data for Name: SequenceItem; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."SequenceItem" (id, "sequenceId", "imageId", "order") FROM stdin;
cmic13f5h0006c8bg8267d3rr	cmic13f5h0004c8bgmbfoj4e2	cmib9kj8e0013c8w4oezzcw79	0
cmic13f5h0007c8bga0mi6cic	cmic13f5h0004c8bgmbfoj4e2	cmib9kjbc0015c8w4fnfn5tnv	1
cmic2geyi0003c894tsvx5tk4	cmic2geyi0001c8941kiwipy3	cmib9khq00002c8w47wmnnmvf	0
cmic2geyi0004c894ufehhy8x	cmic2geyi0001c8941kiwipy3	cmib9khz00008c8w4sl5yrnad	1
cmic2geyi0005c894w11cmycy	cmic2geyi0001c8941kiwipy3	cmib9kih2000kc8w4s62u01l9	2
cmic2gktj0009c8944puagk54	cmic2gktj0007c894x5lvpm7c	cmib9khq00002c8w47wmnnmvf	0
cmic2gktj000ac894rwc18v3m	cmic2gktj0007c894x5lvpm7c	cmib9ki1z000ac8w4hucah8uq	1
cmic2gktj000bc894h7ymx8of	cmic2gktj0007c894x5lvpm7c	cmib9kie2000ic8w4fj9w1vyh	2
cmic2go18000fc894ssr57uwr	cmic2go18000dc89459k0grd3	cmib9kiq5000qc8w4ld1zq10q	0
cmic2gxbf000jc894g5vreejh	cmic2gxbf000hc894i5hi6j52	cmib9krwy0070c8w4oljgs67b	0
cmic821mb0008c8jst6qhlu3k	cmic821mb0006c8jss6gkahx5	cmib9kj8e0013c8w4oezzcw79	0
cmic821mb0009c8jsrcs998do	cmic821mb0006c8jss6gkahx5	cmib9kjbc0015c8w4fnfn5tnv	1
cmic8c7sj0003c8fgm4n3q3r7	cmic8c7sj0001c8fguzp0hq4n	cmib9kj8e0013c8w4oezzcw79	0
cmic8c7sj0004c8fg3emmcgbc	cmic8c7sj0001c8fguzp0hq4n	cmib9kjee0017c8w40ktpowgl	1
cmic8ikue0008c8fgtmcyjvnr	cmic8ikue0006c8fg396yyn4j	cmib9khq00002c8w47wmnnmvf	0
cmic8ikue0009c8fgfiq1t98a	cmic8ikue0006c8fg396yyn4j	cmib9khz00008c8w4sl5yrnad	1
cmic8ikue000ac8fgzkcfbjgq	cmic8ikue0006c8fg396yyn4j	cmib9kj8e0013c8w4oezzcw79	2
cmic8ikue000bc8fgv3db1wqi	cmic8ikue0006c8fg396yyn4j	cmib9kk2m001nc8w4jen75ds3	3
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."Session" (id, "sessionToken", "userId", expires) FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."User" (id, email, name, password, role, "parentId", "childProfile", "createdAt", "updatedAt") FROM stdin;
cmibw6h0g0005c8fs17d6f29b	yagozhao@hotmail.com	Yago de Amorim dos Santos	$2a$10$.fHtoZ9EqRbS7dU8j.o1bOBgLZXWT/pqfUfzlyp6QHLezCir.VSW.	caregiver	\N	\N	2025-11-23 15:47:49.792	2025-11-23 15:47:49.792
cmic3wc5p0003c8144ohso1j0	dante4045@gmail.com	Yago Amorim	$2a$10$gcFNMRnWwD0wmMVbvm5nquSJJ7Xt0lP0m1aPD/px1keKGqQ51c9xC	caregiver	\N	\N	2025-11-23 19:23:53.87	2025-11-23 19:23:53.87
cmic3xdn90004c8141537n987	Swashbuckler3113@outlook.com	Yago Amorim	$2a$10$wDKj0kQ/OT4Z3euQ7fa7eusCfSKiWx/1NagaGiuBaPn3iuDmTEx1O	caregiver	\N	\N	2025-11-23 19:24:42.454	2025-11-23 19:24:42.454
\.


--
-- Data for Name: VerificationToken; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public."VerificationToken" (identifier, token, expires) FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: dicere_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9c79191c-0c2c-4a42-9e2c-dd9823b9fcd5	88b779b65614a8d70df00e7d151eb77b0262a42707391d2050f0a0691b291611	2025-11-23 05:12:54.656645+00	20251122213815_init	\N	\N	2025-11-23 05:12:54.603064+00	1
886c80b5-f56f-47a8-98b8-4b35e7136d57	07fad4869870f511f50443acf823b696a25ec86ee71a15bc52648fbca662fe19	2025-11-23 05:12:54.661491+00	20251122231425_add_custom_categories	\N	\N	2025-11-23 05:12:54.657464+00	1
b8847ad1-c9a5-4aac-b8b2-8a8d938192e1	a55f5bd3f0c1e804b821959c2d49503fe61eefb25adb14f76f0f2c0a9a81213d	2025-11-23 05:12:54.664566+00	20251123033538_init	\N	\N	2025-11-23 05:12:54.662236+00	1
3688f867-2d6b-4676-96da-80bc56abd624	5dfd16251df3b73c421919bdd80d50ebcea245cf03425d77183fadc39e01fafe	\N	20251123172916_add_unique_constraint_to_child_name	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20251123172916_add_unique_constraint_to_child_name\n\nDatabase error code: 23505\n\nDatabase error:\nERROR: could not create unique index "Child_name_key"\nDETAIL: Key (name)=(Enzo) is duplicated.\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E23505), message: "could not create unique index \\"Child_name_key\\"", detail: Some("Key (name)=(Enzo) is duplicated."), hint: None, position: None, where_: None, schema: Some("public"), table: Some("Child"), column: None, datatype: None, constraint: Some("Child_name_key"), file: Some("tuplesortvariants.c"), line: Some(1361), routine: Some("comparetup_index_btree") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20251123172916_add_unique_constraint_to_child_name"\n             at schema-engine\\connectors\\sql-schema-connector\\src\\apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20251123172916_add_unique_constraint_to_child_name"\n             at schema-engine\\commands\\src\\commands\\apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine\\core\\src\\state.rs:225	\N	2025-11-23 17:29:17.02766+00	0
\.


--
-- Name: Account Account_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);


--
-- Name: Category Category_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Category"
    ADD CONSTRAINT "Category_pkey" PRIMARY KEY (id);


--
-- Name: ChildAccess ChildAccess_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."ChildAccess"
    ADD CONSTRAINT "ChildAccess_pkey" PRIMARY KEY (id);


--
-- Name: Child Child_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Child"
    ADD CONSTRAINT "Child_pkey" PRIMARY KEY (id);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Image Image_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_pkey" PRIMARY KEY (id);


--
-- Name: Report Report_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_pkey" PRIMARY KEY (id);


--
-- Name: SequenceItem SequenceItem_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."SequenceItem"
    ADD CONSTRAINT "SequenceItem_pkey" PRIMARY KEY (id);


--
-- Name: Sequence Sequence_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Sequence"
    ADD CONSTRAINT "Sequence_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Account_provider_providerAccountId_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON public."Account" USING btree (provider, "providerAccountId");


--
-- Name: Category_name_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "Category_name_key" ON public."Category" USING btree (name);


--
-- Name: ChildAccess_userId_childId_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "ChildAccess_userId_childId_key" ON public."ChildAccess" USING btree ("userId", "childId");


--
-- Name: Report_childId_date_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "Report_childId_date_key" ON public."Report" USING btree ("childId", date);


--
-- Name: SequenceItem_sequenceId_order_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "SequenceItem_sequenceId_order_key" ON public."SequenceItem" USING btree ("sequenceId", "order");


--
-- Name: Session_sessionToken_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "Session_sessionToken_key" ON public."Session" USING btree ("sessionToken");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VerificationToken_identifier_token_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON public."VerificationToken" USING btree (identifier, token);


--
-- Name: VerificationToken_token_key; Type: INDEX; Schema: public; Owner: dicere_user
--

CREATE UNIQUE INDEX "VerificationToken_token_key" ON public."VerificationToken" USING btree (token);


--
-- Name: Account Account_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Account"
    ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChildAccess ChildAccess_childId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."ChildAccess"
    ADD CONSTRAINT "ChildAccess_childId_fkey" FOREIGN KEY ("childId") REFERENCES public."Child"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ChildAccess ChildAccess_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."ChildAccess"
    ADD CONSTRAINT "ChildAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_sequenceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES public."Sequence"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Image Image_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."Category"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Image Image_uploadedBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Image"
    ADD CONSTRAINT "Image_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Report Report_childId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Report"
    ADD CONSTRAINT "Report_childId_fkey" FOREIGN KEY ("childId") REFERENCES public."Child"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SequenceItem SequenceItem_imageId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."SequenceItem"
    ADD CONSTRAINT "SequenceItem_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES public."Image"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SequenceItem SequenceItem_sequenceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."SequenceItem"
    ADD CONSTRAINT "SequenceItem_sequenceId_fkey" FOREIGN KEY ("sequenceId") REFERENCES public."Sequence"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Sequence Sequence_childId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Sequence"
    ADD CONSTRAINT "Sequence_childId_fkey" FOREIGN KEY ("childId") REFERENCES public."Child"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Session Session_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dicere_user
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict d3JqjhsE6LpolRgKLk0phuJcL0wM1JUP5hoWwHFGKd6z73b5aK0p2fRpShPgmTn

