import type { APIRoute } from 'astro';
import { contact } from '../../../server/contact.mjs';
export const prerender = false;
export const ALL: APIRoute = ({ request }) => contact(request, process.env);
