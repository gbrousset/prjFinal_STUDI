--
-- PostgreSQL database dump
--

-- Dumped from database version 16.4
-- Dumped by pg_dump version 16.4

-- Started on 2024-10-14 16:14:56 CEST

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

--
-- TOC entry 848 (class 1247 OID 16902)
-- Name: enum_Users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."enum_Users_role" AS ENUM (
    'client',
    'admin'
);


ALTER TYPE public."enum_Users_role" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 17499)
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 19619)
-- Name: offers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.offers (
    offer_id integer NOT NULL,
    offer_name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    quantity_total integer NOT NULL,
    quantity_sold integer DEFAULT 0,
    admin_id integer
);


ALTER TABLE public.offers OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 19618)
-- Name: offers_offer_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.offers_offer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.offers_offer_id_seq OWNER TO postgres;

--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 218
-- Name: offers_offer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.offers_offer_id_seq OWNED BY public.offers.offer_id;


--
-- TOC entry 223 (class 1259 OID 19655)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id integer NOT NULL,
    ticket_id integer NOT NULL,
    user_id integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    payment_date timestamp with time zone,
    status character varying(50) NOT NULL
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 19654)
-- Name: payments_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payments_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payments_payment_id_seq OWNER TO postgres;

--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payments_payment_id_seq OWNED BY public.payments.payment_id;


--
-- TOC entry 221 (class 1259 OID 19634)
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    ticket_id integer NOT NULL,
    user_id integer,
    offer_id integer,
    purchase_date timestamp with time zone,
    ticket_key text NOT NULL,
    qr_code text NOT NULL,
    is_validated boolean DEFAULT false,
    validation_date timestamp with time zone,
    purchase_amount numeric(10,2) NOT NULL
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 19633)
-- Name: tickets_ticket_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_ticket_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tickets_ticket_id_seq OWNER TO postgres;

--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 220
-- Name: tickets_ticket_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_ticket_id_seq OWNED BY public.tickets.ticket_id;


--
-- TOC entry 217 (class 1259 OID 19607)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(255),
    password_hash text NOT NULL,
    auth_key text,
    is_2fa_enabled boolean DEFAULT false,
    role character varying(20) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 19606)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 3653 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 3467 (class 2604 OID 19622)
-- Name: offers offer_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers ALTER COLUMN offer_id SET DEFAULT nextval('public.offers_offer_id_seq'::regclass);


--
-- TOC entry 3471 (class 2604 OID 19658)
-- Name: payments payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments ALTER COLUMN payment_id SET DEFAULT nextval('public.payments_payment_id_seq'::regclass);


--
-- TOC entry 3469 (class 2604 OID 19637)
-- Name: tickets ticket_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN ticket_id SET DEFAULT nextval('public.tickets_ticket_id_seq'::regclass);


--
-- TOC entry 3465 (class 2604 OID 19610)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 3636 (class 0 OID 17499)
-- Dependencies: 215
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20241006091417-create-users-table.js
20241006091501-create-offers-table.js
20241006091511-create-tickets-table.js
20241006091537-create-payments-table.js
\.


--
-- TOC entry 3640 (class 0 OID 19619)
-- Dependencies: 219
-- Data for Name: offers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.offers (offer_id, offer_name, description, price, quantity_total, quantity_sold, admin_id) FROM stdin;
72	Offre Test	Ceci est une offre de test	100.00	50	0	\N
73	Offre Test	Ceci est une offre de test	100.00	50	0	\N
74	Offre Test	Ceci est une offre de test	100.00	50	0	\N
75	Offre Test	Ceci est une offre de test	100.00	50	0	\N
76	Offre Test	Ceci est une offre de test	100.00	50	0	\N
77	Offre Test	Ceci est une offre de test	100.00	50	0	\N
66	Duo	Offre duo, pour deux personnes.	49.99	50	0	\N
78	Offre Test	Ceci est une offre de test	100.00	50	0	\N
68	Offre créée	Offre créée par l'admin	30.00	99	1	\N
69	Offre Test	Ceci est une offre de test	100.00	49	1	\N
71	Offre Test	Ceci est une offre de test	100.00	49	1	\N
79	Offre Tuto	Description de l'offre tuto	30.00	20	0	\N
70	Offre Test modifiée	Ceci est une offre de test, nous faisons une modification	89.00	30	0	\N
80	Offre Test	Ceci est une offre de test	100.00	50	0	\N
81	Offre Test	Ceci est une offre de test	100.00	50	0	\N
67	Offre Mise à Jour	Nouvelle description	150.00	30	0	\N
65	Solo	Offre solo, idéale pour une personne.	29.99	49	51	\N
\.


--
-- TOC entry 3644 (class 0 OID 19655)
-- Dependencies: 223
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (payment_id, ticket_id, user_id, amount, payment_date, status) FROM stdin;
54	413	306	29.99	2024-10-12 12:12:37.679145+02	réussi
55	414	327	30.00	2024-10-14 10:39:54.965787+02	réussi
56	415	327	100.00	2024-10-14 10:54:31.583552+02	réussi
57	416	328	100.00	2024-10-14 11:33:40.302554+02	réussi
\.


--
-- TOC entry 3642 (class 0 OID 19634)
-- Dependencies: 221
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (ticket_id, user_id, offer_id, purchase_date, ticket_key, qr_code, is_validated, validation_date, purchase_amount) FROM stdin;
413	306	65	\N	TICKET-ultk7c3ha	QR-TICKET-ultk7c3ha	f	\N	29.99
414	327	68	\N	TICKET-7af8zimkg	QR-TICKET-7af8zimkg	f	\N	30.00
415	327	69	\N	TICKET-qcmz2mg8z	QR-TICKET-qcmz2mg8z	f	\N	100.00
416	328	71	\N	TICKET-hd6cff4s6	QR-TICKET-hd6cff4s6	f	\N	100.00
\.


--
-- TOC entry 3638 (class 0 OID 19607)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, username, email, phone, password_hash, auth_key, is_2fa_enabled, role) FROM stdin;
305	admin_user	admin@example.com	0600000000	$2a$10$XmvttKyz5T6oSzvdDOWnNOik144UN041/eFZbFwv84Xs2mT6aE8U.	17zn4ouze7h	f	admin
306	userTest	user@example.com	0101010101	$2a$10$UT8OGJeLssqywyBB9xw2a.smkWdrYjS0rX8ZtYAKMODooxeu9gygq	31da28d82189b29b6c159618416027233b7a0bc6	f	client
327	Testeur	testeur@example.com	0100000000	$2a$10$WmaaPWtA7B2CWccjqBbtYexC9XYscFlre7HCMGf5d8fvWbZoOSzjm	cf8877fc359ec300f3eee2968216013b29cc6231	f	client
328	testeur2	testeur2@example.com	0200000000	$2a$10$txtldi4KWlFeBoW1D.J/ZeP8x1VpHMvzly0YYv7p9YaZwTt2ZYIT.	f5ebd0e091585a8957f2db7f6d9ff192a7d95603	f	client
\.


--
-- TOC entry 3654 (class 0 OID 0)
-- Dependencies: 218
-- Name: offers_offer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.offers_offer_id_seq', 81, true);


--
-- TOC entry 3655 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payments_payment_id_seq', 57, true);


--
-- TOC entry 3656 (class 0 OID 0)
-- Dependencies: 220
-- Name: tickets_ticket_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_ticket_id_seq', 416, true);


--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 216
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 332, true);


--
-- TOC entry 3473 (class 2606 OID 17503)
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- TOC entry 3483 (class 2606 OID 19627)
-- Name: offers offers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_pkey PRIMARY KEY (offer_id);


--
-- TOC entry 3487 (class 2606 OID 19661)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 3485 (class 2606 OID 19643)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (ticket_id);


--
-- TOC entry 3475 (class 2606 OID 19681)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3477 (class 2606 OID 19683)
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- TOC entry 3479 (class 2606 OID 19685)
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- TOC entry 3481 (class 2606 OID 19615)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3488 (class 2606 OID 19694)
-- Name: offers offers_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.offers
    ADD CONSTRAINT offers_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(user_id);


--
-- TOC entry 3491 (class 2606 OID 19711)
-- Name: payments payments_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(ticket_id);


--
-- TOC entry 3492 (class 2606 OID 19716)
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3489 (class 2606 OID 19704)
-- Name: tickets tickets_offer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_offer_id_fkey FOREIGN KEY (offer_id) REFERENCES public.offers(offer_id);


--
-- TOC entry 3490 (class 2606 OID 19699)
-- Name: tickets tickets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


-- Completed on 2024-10-14 16:14:56 CEST

--
-- PostgreSQL database dump complete
--

