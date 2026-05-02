import { Fragment as e, Teleport as t, Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createStaticVNode as c, createTextVNode as l, createVNode as u, inject as d, isRef as f, mergeProps as p, nextTick as m, normalizeClass as h, normalizeStyle as g, onMounted as _, onUnmounted as v, openBlock as y, provide as b, ref as x, renderList as S, shallowRef as C, toDisplayString as w, unref as T, useTemplateRef as E, vModelSelect as D, vModelText as O, watch as k, withCtx as A, withDirectives as j, withModifiers as M } from "vue";
import { FlexRender as N, getCoreRowModel as P, getFilteredRowModel as F, getPaginationRowModel as I, getSortedRowModel as L, useVueTable as R } from "@tanstack/vue-table";
import { useVirtualizer as z } from "@tanstack/vue-virtual";
import { onClickOutside as ee } from "@vueuse/core";
//#region src/components/DataTable/SortPanel.vue
var B = { class: "p-3" }, V = {
	key: 0,
	class: "text-center py-4",
	style: { color: "var(--st-text-tertiary)" }
}, H = {
	key: 1,
	class: "text-xs font-medium uppercase tracking-wide mb-2",
	style: { color: "var(--st-text-placeholder)" }
}, U = ["onDragstart", "onDragover"], W = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, G = ["onUpdate:modelValue"], K = ["value"], q = ["onClick", "title"], te = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, J = {
	key: 0,
	d: "M3.5 12.5V2.707l-1.146 1.147a.5.5 0 01-.708-.708l2-2a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L3.5 2.707V12.5a.5.5 0 01-1 0z"
}, ne = {
	key: 1,
	d: "M3.5 3.5v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L4.5 13.293V3.5a.5.5 0 00-1 0z"
}, re = ["onClick"], Y = ["onDragstart", "onDragover"], ie = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, ae = ["onUpdate:modelValue"], oe = ["value"], se = ["onClick", "title"], X = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, ce = {
	key: 0,
	d: "M3.5 12.5V2.707l-1.146 1.147a.5.5 0 01-.708-.708l2-2a.5.5 0 01.708 0l2 2a.5.5 0 01-.708.708L3.5 2.707V12.5a.5.5 0 01-1 0z"
}, le = {
	key: 1,
	d: "M3.5 3.5v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L4.5 13.293V3.5a.5.5 0 00-1 0z"
}, ue = ["onClick"], de = {
	class: "px-3 py-2 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, fe = {
	__name: "SortPanel",
	props: {
		table: {
			type: Object,
			required: !0
		},
		sorting: {
			type: Array,
			default: () => []
		},
		allColumns: {
			type: Array,
			default: () => []
		},
		subTableColumns: {
			type: Array,
			default: null
		},
		subTableSorting: {
			type: Array,
			default: () => []
		},
		tableName: {
			type: String,
			default: "table"
		}
	},
	emits: [
		"update:sorting",
		"update:sub-table-sorting",
		"close"
	],
	setup(t, { emit: n }) {
		let i = t, u = n, f = d("showDataTypes", !0), p = r(() => !!i.subTableColumns && i.subTableColumns.length > 0);
		function m() {
			let e = i.sorting.map((e) => ({
				...e,
				table: "parent"
			})), t = i.subTableSorting.map((e) => ({
				...e,
				table: "sub"
			}));
			return [...e, ...t];
		}
		let h = x(m());
		k([() => i.sorting, () => i.subTableSorting], () => {
			h.value = m();
		}, { deep: !0 });
		function _(e) {
			let t = e === "parent" ? i.allColumns : i.subTableColumns, n = new Set(h.value.filter((t) => t.table === e).map((e) => e.id)), r = t.find((e) => !n.has(e.id));
			r && h.value.push({
				id: r.id,
				desc: !1,
				table: e
			});
		}
		function v(e) {
			h.value.splice(e, 1);
		}
		function b(e) {
			h.value[e].desc = !h.value[e].desc;
		}
		function C() {
			let e = h.value.filter((e) => e.table === "parent").map(({ table: e, ...t }) => t), t = h.value.filter((e) => e.table === "sub").map(({ table: e, ...t }) => t);
			u("update:sorting", e), p.value && u("update:sub-table-sorting", t), u("close");
		}
		function E() {
			h.value = [], u("update:sorting", []), p.value && u("update:sub-table-sorting", []), u("close");
		}
		let O = r(() => h.value.filter((e) => e.table === "parent")), A = r(() => h.value.filter((e) => e.table === "sub"));
		function N(e, t) {
			let n = 0;
			for (let r = 0; r < h.value.length; r++) if (h.value[r].table === e) {
				if (n === t) return r;
				n++;
			}
			return -1;
		}
		let P = x(null), F = x(null);
		function I(e) {
			P.value = e;
		}
		function L(e, t) {
			e.preventDefault(), F.value = t;
		}
		function R() {
			if (P.value !== null && F.value !== null && P.value !== F.value) {
				let e = [...h.value], [t] = e.splice(P.value, 1);
				e.splice(F.value, 0, t), h.value = e;
			}
			P.value = null, F.value = null;
		}
		return (n, r) => (y(), o("div", {
			class: "absolute top-full right-0 mt-1 w-96 rounded shadow-xl z-50 text-[13px]",
			style: {
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			},
			onClick: r[2] ||= M(() => {}, ["stop"])
		}, [s("div", B, [
			h.value.length === 0 ? (y(), o("div", V, [...r[3] ||= [s("p", { class: "mb-1" }, "No sorts applied to this view", -1), s("p", { class: "text-xs" }, "Add a column below to sort the view", -1)]])) : a("", !0),
			p.value ? (y(), o("div", H, w(t.tableName), 1)) : a("", !0),
			(y(!0), o(e, null, S(O.value, (n, i) => (y(), o("div", {
				key: "p-" + i,
				class: "flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors",
				style: g(F.value === N("parent", i) && P.value !== N("parent", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
				draggable: "true",
				onDragstart: (e) => I(N("parent", i)),
				onDragover: (e) => L(e, N("parent", i)),
				onDragend: R
			}, [
				r[5] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\"><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\"><circle cx=\"5.5\" cy=\"4\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\"></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\"></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\"></circle></svg></span>", 1),
				s("span", W, w(i === 0 ? "sort by" : "then by"), 1),
				j(s("select", {
					"onUpdate:modelValue": (e) => n.id = e,
					class: "flex-1 rounded px-2 py-1 text-[13px] outline-none min-w-0",
					style: {
						backgroundColor: "var(--st-bg)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					}
				}, [(y(!0), o(e, null, S(t.allColumns, (t) => (y(), o("option", {
					key: t.id,
					value: t.id
				}, [l(w(t.id), 1), T(f) ? (y(), o(e, { key: 0 }, [l(" (" + w(t.type) + ")", 1)], 64)) : a("", !0)], 8, K))), 128))], 8, G), [[D, n.id]]),
				s("button", {
					class: "shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
					style: g(n.desc ? {
						color: "var(--st-text-secondary)",
						backgroundColor: "var(--st-bg)",
						border: "1px solid var(--st-border-secondary)"
					} : {
						color: "var(--st-accent)",
						backgroundColor: "var(--st-accent-bg)",
						border: "1px solid var(--st-accent-border-light)"
					}),
					onClick: (e) => b(N("parent", i)),
					title: n.desc ? "Descending — click to toggle" : "Ascending — click to toggle"
				}, [(y(), o("svg", te, [n.desc ? (y(), o("path", ne)) : (y(), o("path", J))])), l(" " + w(n.desc ? "DESC" : "ASC"), 1)], 12, q),
				s("button", {
					class: "shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors",
					style: { color: "var(--st-text-tertiary)" },
					title: "Remove sort rule",
					onClick: (e) => v(N("parent", i))
				}, [...r[4] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, re)
			], 44, U))), 128)),
			s("button", {
				class: "text-[13px] mt-1",
				style: { color: "var(--st-text-secondary)" },
				onClick: r[0] ||= (e) => _("parent")
			}, " + Pick a column to sort by "),
			p.value ? (y(), o(e, { key: 2 }, [
				r[8] ||= s("div", {
					class: "my-3",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				r[9] ||= s("div", {
					class: "text-xs font-medium uppercase tracking-wide mb-2",
					style: { color: "var(--st-text-placeholder)" }
				}, " Sub-table ", -1),
				(y(!0), o(e, null, S(A.value, (n, i) => (y(), o("div", {
					key: "s-" + i,
					class: "flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors",
					style: g(F.value === N("sub", i) && P.value !== N("sub", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					draggable: "true",
					onDragstart: (e) => I(N("sub", i)),
					onDragover: (e) => L(e, N("sub", i)),
					onDragend: R
				}, [
					r[7] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\"><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\"><circle cx=\"5.5\" cy=\"4\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\"></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\"></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\"></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\"></circle></svg></span>", 1),
					s("span", ie, w(i === 0 ? "sort by" : "then by"), 1),
					j(s("select", {
						"onUpdate:modelValue": (e) => n.id = e,
						class: "flex-1 rounded px-2 py-1 text-[13px] outline-none min-w-0",
						style: {
							backgroundColor: "var(--st-bg)",
							border: "1px solid var(--st-border-secondary)",
							color: "var(--st-text)"
						}
					}, [(y(!0), o(e, null, S(t.subTableColumns, (t) => (y(), o("option", {
						key: t.id,
						value: t.id
					}, [l(w(t.id), 1), T(f) ? (y(), o(e, { key: 0 }, [l(" (" + w(t.type) + ")", 1)], 64)) : a("", !0)], 8, oe))), 128))], 8, ae), [[D, n.id]]),
					s("button", {
						class: "shrink-0 flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
						style: g(n.desc ? {
							color: "var(--st-text-secondary)",
							backgroundColor: "var(--st-bg)",
							border: "1px solid var(--st-border-secondary)"
						} : {
							color: "var(--st-accent)",
							backgroundColor: "var(--st-accent-bg)",
							border: "1px solid var(--st-accent-border-light)"
						}),
						onClick: (e) => b(N("sub", i)),
						title: n.desc ? "Descending — click to toggle" : "Ascending — click to toggle"
					}, [(y(), o("svg", X, [n.desc ? (y(), o("path", le)) : (y(), o("path", ce))])), l(" " + w(n.desc ? "DESC" : "ASC"), 1)], 12, se),
					s("button", {
						class: "shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors",
						style: { color: "var(--st-text-tertiary)" },
						title: "Remove sort rule",
						onClick: (e) => v(N("sub", i))
					}, [...r[6] ||= [s("svg", {
						class: "w-3.5 h-3.5",
						viewBox: "0 0 16 16",
						fill: "currentColor"
					}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, ue)
				], 44, Y))), 128)),
				s("button", {
					class: "text-[13px] mt-1",
					style: { color: "var(--st-text-secondary)" },
					onClick: r[1] ||= (e) => _("sub")
				}, " + Pick a column to sort by ")
			], 64)) : a("", !0)
		]), s("div", de, [h.value.length > 0 ? (y(), o("button", {
			key: 0,
			class: "px-3 py-1 rounded text-[13px] transition-colors",
			style: {
				border: "1px solid var(--st-border-secondary)",
				color: "var(--st-text-secondary)"
			},
			onClick: E
		}, " Clear sorting ")) : a("", !0), s("button", {
			class: "px-3 py-1 rounded text-[13px] font-medium transition-colors",
			style: {
				backgroundColor: "var(--st-accent)",
				color: "var(--st-text-on-accent)"
			},
			onClick: C
		}, " Apply sorting ")])]));
	}
}, pe = [
	"date",
	"time",
	"timetz",
	"timestamp",
	"timestamptz",
	"datetime"
], me = [
	{
		group: "Comparison",
		operators: [
			{
				label: "Equals",
				value: "="
			},
			{
				label: "Not equal",
				value: "<>"
			},
			{
				label: "Greater than",
				value: ">"
			},
			{
				label: "Less than",
				value: "<"
			},
			{
				label: "Greater or equal",
				value: ">="
			},
			{
				label: "Less or equal",
				value: "<="
			}
		]
	},
	{
		group: "Pattern Matching",
		operators: [{
			label: "Like",
			value: "~~"
		}, {
			label: "iLike",
			value: "~~*"
		}]
	},
	{
		group: "Set & Null Checks",
		operators: [{
			label: "In list",
			value: "in"
		}, {
			label: "Is",
			value: "is"
		}]
	}
], Z = {
	INSERT: "insert",
	UPDATE: "update",
	DELETE: "delete"
}, he = "__pending_", ge = { class: "relative flex items-center" }, _e = {
	key: 0,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, ve = {
	key: 1,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, ye = {
	class: "rounded-lg shadow-xl p-3",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, be = ["type", "value"], xe = {
	__name: "FilterDatePicker",
	props: {
		value: {
			type: String,
			default: ""
		},
		columnType: {
			type: String,
			default: "date"
		}
	},
	emits: ["update"],
	setup(e, { emit: n }) {
		let c = e, l = n, u = d("themeVars", {}), f = r(() => (u?.value ?? u)?.["--st-bg"]?.startsWith("#1") ? "dark" : "light"), p = x(!1), m = x(null), h = x(null), _ = r(() => {
			let e = c.columnType;
			return e === "time" || e === "timetz" ? "time" : e === "date" ? "date" : "datetime-local";
		}), v = r(() => c.value ? _.value === "datetime-local" ? c.value.replace(" ", "T").slice(0, 16) : c.value.slice(0, _.value === "time" ? 5 : 10) : "");
		function b(e) {
			return e ? _.value === "datetime-local" ? e.replace("T", " ") + ":00" : e : "";
		}
		function S(e) {
			l("update", b(e.target.value)), p.value = !1;
		}
		function C() {
			p.value = !p.value;
		}
		function w() {
			p.value = !1;
		}
		function E() {
			w();
		}
		return (e, n) => (y(), o("div", ge, [s("button", {
			ref_key: "triggerRef",
			ref: h,
			class: "flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0",
			style: g({ color: p.value ? "var(--st-accent)" : "var(--st-text-placeholder)" }),
			title: "Pick date/time",
			onClick: M(C, ["stop"])
		}, [_.value === "time" ? (y(), o("svg", _e, [...n[1] ||= [s("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25a.75.75 0 00-1.5 0v3.5c0 .27.144.518.378.651l2.5 1.5a.75.75 0 10.744-1.302L8.5 7.742V4.75z" }, null, -1)]])) : (y(), o("svg", ve, [...n[2] ||= [s("path", { d: "M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h10.5V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5H2.5z" }, null, -1)]]))], 4), (y(), i(t, { to: "body" }, [p.value ? (y(), o("div", {
			key: 0,
			class: "fixed inset-0 z-40",
			onClick: E
		})) : a("", !0), p.value ? (y(), o("div", {
			key: 1,
			ref_key: "pickerRef",
			ref: m,
			class: "fixed z-50",
			style: g({
				...T(u),
				top: h.value ? h.value.getBoundingClientRect().bottom + 6 + "px" : "0",
				left: h.value ? h.value.getBoundingClientRect().left + "px" : "0"
			}),
			onClick: n[0] ||= M(() => {}, ["stop"])
		}, [s("div", ye, [s("input", {
			type: _.value,
			value: v.value,
			class: "outline-none rounded px-2 py-1.5 text-[13px]",
			style: g({
				backgroundColor: "var(--st-bg-input)",
				border: "1px solid var(--st-border-secondary)",
				color: "var(--st-text)",
				colorScheme: f.value
			}),
			onChange: S
		}, null, 44, be)])], 4)) : a("", !0)]))]));
	}
}, Se = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, Ce = { class: "flex items-center gap-1.5 flex-wrap flex-1 min-w-0" }, we = {
	key: 0,
	class: "text-[10px] font-medium uppercase px-1 rounded",
	style: {
		color: "var(--st-text-placeholder)",
		backgroundColor: "var(--st-bg-input)"
	}
}, Te = { style: { color: "var(--st-text-secondary)" } }, Ee = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Q = ["value", "onInput"], De = ["onClick"], Oe = {
	key: 0,
	class: "flex items-center gap-1 rounded px-2 py-0.5 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-accent-border)"
	}
}, ke = {
	key: 0,
	class: "text-[10px] font-medium uppercase px-1 rounded",
	style: {
		color: "var(--st-text-placeholder)",
		backgroundColor: "var(--st-bg-input)"
	}
}, Ae = { style: { color: "var(--st-text-secondary)" } }, je = { class: "relative flex-1 min-w-[200px]" }, Me = ["placeholder"], Ne = {
	key: 0,
	id: "column-picker",
	class: "absolute top-full left-0 mt-1 w-60 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Pe = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, Fe = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], $ = { style: { color: "var(--st-text)" } }, Ie = {
	key: 0,
	class: "text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Le = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], Re = { style: { color: "var(--st-text)" } }, ze = {
	key: 0,
	class: "text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Be = {
	key: 2,
	class: "px-3 py-2 text-[13px]",
	style: { color: "var(--st-text-placeholder)" }
}, Ve = {
	key: 1,
	id: "operator-picker",
	class: "absolute top-full left-0 mt-1 w-52 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, He = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, Ue = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], We = { style: { color: "var(--st-text)" } }, Ge = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Ke = /* @__PURE__ */ Se({
	__name: "FilterBar",
	props: {
		table: {
			type: Object,
			required: !0
		},
		columnFilters: {
			type: Array,
			default: () => []
		},
		allColumns: {
			type: Array,
			default: () => []
		},
		subTableColumns: {
			type: Array,
			default: null
		},
		subTableColumnFilters: {
			type: Array,
			default: () => []
		},
		tableName: {
			type: String,
			default: "table"
		}
	},
	emits: ["update:column-filters", "update:sub-table-column-filters"],
	setup(n, { emit: c }) {
		let l = n, u = c, f = d("showDataTypes", !0), p = r(() => !!l.subTableColumns && l.subTableColumns.length > 0), h = r(() => {
			let e = l.columnFilters.map((e, t) => ({
				...e,
				table: "parent",
				sourceIndex: t
			})), t = l.subTableColumnFilters.map((e, t) => ({
				...e,
				table: "sub",
				sourceIndex: t
			}));
			return [...e, ...t];
		}), _ = x("closed"), v = x(null), b = x(""), C = x(0), E = x(null), D = x({}), A = r(() => {
			let e = [];
			for (let t of me) {
				e.push({
					type: "header",
					label: t.group
				});
				for (let n of t.operators) e.push({
					type: "operator",
					...n
				});
			}
			return e;
		}), M = r(() => A.value.filter((e) => e.type === "operator")), N = r(() => {
			let e = b.value.toLowerCase();
			return e ? l.allColumns.filter((t) => t.id.toLowerCase().includes(e)) : l.allColumns;
		}), P = r(() => {
			if (!p.value) return [];
			let e = b.value.toLowerCase();
			return e ? l.subTableColumns.filter((t) => t.id.toLowerCase().includes(e)) : l.subTableColumns;
		}), F = r(() => {
			let e = [];
			for (let t of N.value) e.push({
				...t,
				table: "parent"
			});
			for (let t of P.value) e.push({
				...t,
				table: "sub"
			});
			return e;
		}), I = r(() => `Filter by ${l.allColumns.map((e) => e.id).slice(0, 3).join(", ")}...`), L = r(() => {
			let e = l.subTableColumns || [];
			return [...l.allColumns, ...e];
		});
		function R(e) {
			return L.value.find((t) => t.id === e)?.type || "varchar";
		}
		function z(e) {
			return pe.includes(R(e));
		}
		function ee(e) {
			return e.value?.operator || "=";
		}
		function B(e) {
			return e.value?.value ?? "";
		}
		function V() {
			_.value = "columns", C.value = 0;
		}
		function H(e, t) {
			v.value = {
				id: e,
				table: t
			}, b.value = "", _.value = "operators", C.value = 0;
		}
		function U(e) {
			if (!v.value) return;
			let { id: t, table: n } = v.value, r = {
				id: t,
				value: {
					operator: e,
					value: ""
				}
			};
			n === "sub" ? u("update:sub-table-column-filters", [...l.subTableColumnFilters, r]) : u("update:column-filters", [...l.columnFilters, r]), _.value = "closed", v.value = null, b.value = "", E.value?.blur();
			let i = () => {
				let e = h.value.length - 1, t = D.value[e];
				t ? t.focus() : m(i);
			};
			m(() => m(i));
		}
		function W(e) {
			let t = h.value[e];
			t.table === "sub" ? u("update:sub-table-column-filters", l.subTableColumnFilters.filter((e, n) => n !== t.sourceIndex)) : u("update:column-filters", l.columnFilters.filter((e, n) => n !== t.sourceIndex));
		}
		function G(e, t) {
			let n = h.value[e];
			if (n.table === "sub") {
				let e = [...l.subTableColumnFilters], r = e[n.sourceIndex], i = r.value?.operator || "=";
				e[n.sourceIndex] = {
					...r,
					value: {
						operator: i,
						value: t
					}
				}, u("update:sub-table-column-filters", e);
			} else {
				let e = [...l.columnFilters], r = e[n.sourceIndex], i = r.value?.operator || "=";
				e[n.sourceIndex] = {
					...r,
					value: {
						operator: i,
						value: t
					}
				}, u("update:column-filters", e);
			}
		}
		function K(e) {
			_.value === "columns" ? q(e) : _.value === "operators" ? te(e) : e.key !== "Escape" && V(), e.key === "Escape" && (ne(), E.value?.blur());
		}
		function q(e) {
			let t = F.value;
			if (t.length !== 0) {
				if (e.key === "ArrowDown") e.preventDefault(), C.value = Math.min(C.value + 1, t.length - 1), J("column-picker");
				else if (e.key === "ArrowUp") e.preventDefault(), C.value = Math.max(C.value - 1, 0), J("column-picker");
				else if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					let n = t[C.value];
					n && H(n.id, n.table);
				}
			}
		}
		function te(e) {
			let t = M.value;
			t.length !== 0 && (e.key === "ArrowDown" ? (e.preventDefault(), C.value = Math.min(C.value + 1, t.length - 1), J("operator-picker")) : e.key === "ArrowUp" ? (e.preventDefault(), C.value = Math.max(C.value - 1, 0), J("operator-picker")) : (e.key === "Enter" || e.key === "Tab") && (e.preventDefault(), t[C.value] && U(t[C.value].value)));
		}
		function J(e) {
			m(() => {
				let t = document.getElementById(e)?.querySelector("[data-highlighted=\"true\"]");
				t && t.scrollIntoView({ block: "nearest" });
			});
		}
		function ne() {
			_.value = "closed", v.value = null, b.value = "", C.value = 0;
		}
		function re() {
			_.value === "closed" && V();
		}
		function Y(e, t) {
			return e === "parent" ? t : N.value.length + t;
		}
		return k(b, () => {
			C.value = 0;
		}), (r, c) => (y(), o("div", Ce, [
			(y(!0), o(e, null, S(h.value, (e, t) => (y(), o("div", {
				key: e.table + "-" + e.sourceIndex,
				class: "flex items-center gap-1 rounded px-2 py-0.5 text-[13px]",
				style: {
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)"
				}
			}, [
				p.value ? (y(), o("span", we, w(e.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0),
				s("span", Te, w(e.id), 1),
				s("span", Ee, w(ee(e)), 1),
				s("input", {
					ref_for: !0,
					ref: (e) => {
						e && (D.value[t] = e);
					},
					value: B(e),
					class: "bg-transparent outline-none text-[13px]",
					style: g({
						color: "var(--st-text)",
						width: Math.max(3, (B(e) || "").length + 1) + "ch"
					}),
					placeholder: "value",
					onInput: (e) => G(t, e.target.value)
				}, null, 44, Q),
				z(e.id) ? (y(), i(xe, {
					key: 1,
					value: B(e),
					"column-type": R(e.id),
					onUpdate: (e) => G(t, e)
				}, null, 8, [
					"value",
					"column-type",
					"onUpdate"
				])) : a("", !0),
				s("button", {
					class: "ml-0.5 w-5 h-5 flex items-center justify-center rounded transition-colors filter-chip-close shrink-0",
					style: { color: "var(--st-text-placeholder)" },
					onClick: (e) => W(t)
				}, [...c[1] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, De)
			]))), 128)),
			v.value ? (y(), o("div", Oe, [p.value ? (y(), o("span", ke, w(v.value.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0), s("span", Ae, w(v.value.id), 1)])) : a("", !0),
			s("div", je, [
				j(s("input", {
					ref_key: "searchInputRef",
					ref: E,
					"onUpdate:modelValue": c[0] ||= (e) => b.value = e,
					class: "w-full bg-transparent outline-none text-[13px] py-1",
					style: g({
						color: "var(--st-text)",
						caretColor: _.value === "operators" ? "transparent" : void 0
					}),
					placeholder: _.value === "operators" ? "Pick a filter method..." : h.value.length > 0 ? "+ Add more filters..." : I.value,
					onFocus: re,
					onKeydown: K
				}, null, 44, Me), [[O, b.value]]),
				_.value === "columns" ? (y(), o("div", Ne, [
					p.value && N.value.length > 0 ? (y(), o("div", Pe, w(n.tableName), 1)) : a("", !0),
					(y(!0), o(e, null, S(N.value, (e, t) => (y(), o("div", {
						key: "p-" + e.id,
						class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
						"data-highlighted": Y("parent", t) === C.value,
						style: g(Y("parent", t) === C.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
						onClick: (t) => H(e.id, "parent"),
						onMouseenter: (e) => C.value = Y("parent", t)
					}, [s("span", $, w(e.id), 1), T(f) ? (y(), o("span", Ie, w(e.type), 1)) : a("", !0)], 44, Fe))), 128)),
					p.value && P.value.length > 0 ? (y(), o(e, { key: 1 }, [
						c[2] ||= s("div", {
							class: "my-1",
							style: { borderTop: "1px solid var(--st-border-secondary)" }
						}, null, -1),
						c[3] ||= s("div", {
							class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
							style: { color: "var(--st-text-placeholder)" }
						}, " Sub-table ", -1),
						(y(!0), o(e, null, S(P.value, (e, t) => (y(), o("div", {
							key: "s-" + e.id,
							class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
							"data-highlighted": Y("sub", t) === C.value,
							style: g(Y("sub", t) === C.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
							onClick: (t) => H(e.id, "sub"),
							onMouseenter: (e) => C.value = Y("sub", t)
						}, [s("span", Re, w(e.id), 1), T(f) ? (y(), o("span", ze, w(e.type), 1)) : a("", !0)], 44, Le))), 128))
					], 64)) : a("", !0),
					N.value.length === 0 && P.value.length === 0 ? (y(), o("div", Be, " No columns found ")) : a("", !0)
				])) : a("", !0),
				_.value === "operators" ? (y(), o("div", Ve, [(y(!0), o(e, null, S(A.value, (t, n) => (y(), o(e, { key: n }, [t.type === "header" ? (y(), o("div", He, w(t.label), 1)) : (y(), o("div", {
					key: 1,
					class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
					"data-highlighted": M.value.indexOf(t) === C.value,
					style: g(M.value.indexOf(t) === C.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					onClick: (e) => U(t.value),
					onMouseenter: (e) => C.value = M.value.indexOf(t)
				}, [s("span", We, w(t.label), 1), s("span", Ge, w(t.value), 1)], 44, Ue))], 64))), 128))])) : a("", !0),
				(y(), i(t, { to: "body" }, [_.value === "closed" ? a("", !0) : (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: ne
				}))]))
			])
		]));
	}
}, [["__scopeId", "data-v-39776528"]]), qe = {
	class: "px-3 py-2 flex items-center justify-between",
	style: { borderBottom: "1px solid var(--st-border-secondary)" }
}, Je = {
	class: "font-medium",
	style: { color: "var(--st-text-secondary)" }
}, Ye = { class: "max-h-72 overflow-auto py-1" }, Xe = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, Ze = ["onClick"], Qe = {
	key: 0,
	class: "w-3 h-3",
	style: { color: "var(--st-text-on-accent)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, $e = {
	key: 0,
	class: "text-xs ml-auto shrink-0",
	style: { color: "var(--st-text-placeholder)" }
}, et = ["onClick"], tt = {
	key: 0,
	class: "w-3 h-3",
	style: { color: "var(--st-text-on-accent)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, nt = {
	key: 0,
	class: "text-xs ml-auto shrink-0",
	style: { color: "var(--st-text-placeholder)" }
}, rt = /* @__PURE__ */ Se({
	__name: "ColumnVisibilityPanel",
	props: {
		table: {
			type: Object,
			required: !0
		},
		columnVisibility: {
			type: Object,
			default: () => ({})
		},
		defaultColumnVisibility: {
			type: Object,
			default: () => ({})
		},
		subTableColumns: {
			type: Array,
			default: null
		},
		subTableColumnVisibility: {
			type: Object,
			default: () => ({})
		},
		tableName: {
			type: String,
			default: "table"
		}
	},
	emits: [
		"update:column-visibility",
		"update:sub-table-column-visibility",
		"close"
	],
	setup(t, { emit: n }) {
		let i = t, c = n, l = d("showDataTypes", !0), u = r(() => !!i.subTableColumns && i.subTableColumns.length > 0), f = r(() => i.table.getAllLeafColumns().map((e) => ({
			id: e.id,
			type: e.columnDef.meta?.type || "text",
			isVisible: i.columnVisibility[e.id] !== !1
		}))), p = r(() => u.value ? i.subTableColumns.map((e) => ({
			id: e.id,
			type: e.type || "text",
			isVisible: i.subTableColumnVisibility[e.id] !== !1
		})) : []), m = r(() => f.value.filter((e) => e.isVisible).length), h = r(() => p.value.filter((e) => e.isVisible).length), _ = r(() => m.value + h.value), v = r(() => f.value.length + p.value.length);
		function b(e) {
			let t = { ...i.columnVisibility };
			t[e] = t[e] === !1, c("update:column-visibility", t);
		}
		function x(e) {
			let t = { ...i.subTableColumnVisibility };
			t[e] = t[e] === !1, c("update:sub-table-column-visibility", t);
		}
		function C() {
			let e = {};
			if (f.value.forEach((t) => {
				e[t.id] = !0;
			}), c("update:column-visibility", e), u.value) {
				let e = {};
				p.value.forEach((t) => {
					e[t.id] = !0;
				}), c("update:sub-table-column-visibility", e);
			}
		}
		function E() {
			c("update:column-visibility", { ...i.defaultColumnVisibility }), u.value && c("update:sub-table-column-visibility", {});
		}
		return (n, r) => (y(), o("div", {
			class: "absolute top-full right-0 mt-1 w-64 rounded shadow-xl z-50 text-[13px]",
			style: {
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			},
			onClick: r[0] ||= M(() => {}, ["stop"])
		}, [s("div", qe, [s("span", Je, w(_.value) + " of " + w(v.value) + " columns", 1), s("div", { class: "flex items-center gap-2" }, [
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: C
			}, "Show all"),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: E
			}, "Default")
		])]), s("div", Ye, [
			u.value ? (y(), o("div", Xe, w(t.tableName), 1)) : a("", !0),
			(y(!0), o(e, null, S(f.value, (e) => (y(), o("button", {
				key: "p-" + e.id,
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2.5 transition-colors hover-menu-item",
				onClick: (t) => b(e.id)
			}, [
				s("span", {
					class: "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
					style: g(e.isVisible ? {
						backgroundColor: "var(--st-accent)",
						borderColor: "var(--st-accent)"
					} : {
						borderColor: "var(--st-border-tertiary)",
						backgroundColor: "transparent"
					})
				}, [e.isVisible ? (y(), o("svg", Qe, [...r[2] ||= [s("path", { d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" }, null, -1)]])) : a("", !0)], 4),
				s("span", {
					class: "truncate",
					style: g({ color: e.isVisible ? "var(--st-text)" : "var(--st-text-tertiary)" })
				}, w(e.id), 5),
				T(l) ? (y(), o("span", $e, w(e.type), 1)) : a("", !0)
			], 8, Ze))), 128)),
			u.value ? (y(), o(e, { key: 1 }, [
				r[4] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				r[5] ||= s("div", {
					class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
					style: { color: "var(--st-text-placeholder)" }
				}, " Sub-table ", -1),
				(y(!0), o(e, null, S(p.value, (e) => (y(), o("button", {
					key: "s-" + e.id,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2.5 transition-colors hover-menu-item",
					onClick: (t) => x(e.id)
				}, [
					s("span", {
						class: "w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
						style: g(e.isVisible ? {
							backgroundColor: "var(--st-accent)",
							borderColor: "var(--st-accent)"
						} : {
							borderColor: "var(--st-border-tertiary)",
							backgroundColor: "transparent"
						})
					}, [e.isVisible ? (y(), o("svg", tt, [...r[3] ||= [s("path", { d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" }, null, -1)]])) : a("", !0)], 4),
					s("span", {
						class: "truncate",
						style: g({ color: e.isVisible ? "var(--st-text)" : "var(--st-text-tertiary)" })
					}, w(e.id), 5),
					T(l) ? (y(), o("span", nt, w(e.type), 1)) : a("", !0)
				], 8, et))), 128))
			], 64)) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-c662bbfe"]]), it = { style: {
	borderBottom: "1px solid var(--st-border)",
	backgroundColor: "var(--st-bg)"
} }, at = { class: "flex items-center gap-2 px-3 py-2" }, ot = ["disabled"], st = { class: "relative" }, ct = ["disabled"], lt = {
	key: 0,
	class: "relative"
}, ut = ["disabled"], dt = {
	key: 0,
	class: "absolute top-full left-0 mt-1 min-w-[12rem] rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, ft = {
	key: 0,
	class: "my-1",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, pt = ["disabled", "onClick"], mt = ["innerHTML"], ht = { class: "flex-1" }, gt = { class: "relative" }, _t = ["disabled"], vt = {
	key: 1,
	class: "relative"
}, yt = {
	key: 0,
	class: "flex items-center"
}, bt = {
	key: 2,
	class: "absolute top-full right-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, xt = /* @__PURE__ */ Se({
	__name: "TableToolbar",
	props: {
		table: {
			type: Object,
			required: !0
		},
		sorting: {
			type: Array,
			default: () => []
		},
		columnFilters: {
			type: Array,
			default: () => []
		},
		columnVisibility: {
			type: Object,
			default: () => ({})
		},
		defaultColumnVisibility: {
			type: Object,
			default: () => ({})
		},
		editable: {
			type: Object,
			default: () => ({
				insert: !0,
				update: !0,
				delete: !0
			})
		},
		loading: {
			type: Boolean,
			default: !1
		},
		defaultInsertLabel: {
			type: String,
			default: null
		},
		toolbarActions: {
			type: Array,
			default: () => []
		},
		toolbarActionsLabel: {
			type: String,
			default: "Actions"
		},
		subTableColumns: {
			type: Array,
			default: null
		},
		subTableSorting: {
			type: Array,
			default: () => []
		},
		subTableColumnFilters: {
			type: Array,
			default: () => []
		},
		subTableColumnVisibility: {
			type: Object,
			default: () => ({})
		},
		tableName: {
			type: String,
			default: "table"
		},
		isEmpty: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"update:sorting",
		"update:column-filters",
		"update:column-visibility",
		"update:sub-table-sorting",
		"update:sub-table-column-filters",
		"update:sub-table-column-visibility",
		"insert-row",
		"refresh",
		"toolbar-action"
	],
	setup(n, { emit: c }) {
		let d = n, f = c, p = x(!1), m = x(!1), _ = x(!1), v = x(!1);
		function b(e) {
			e.disabled || (f("toolbar-action", e.key), v.value = !1);
		}
		let C = r(() => d.sorting.length + d.subTableSorting.length);
		r(() => d.columnFilters.length + d.subTableColumnFilters.length);
		let T = r(() => Object.values(d.columnVisibility).filter((e) => e === !1).length + Object.values(d.subTableColumnVisibility).filter((e) => e === !1).length), E = r(() => {
			let e = d.columnVisibility, t = d.defaultColumnVisibility, n = d.table.getAllColumns().map((e) => e.id);
			for (let r of n) if (e[r] !== !1 != (t[r] !== !1)) return !1;
			for (let e of Object.values(d.subTableColumnVisibility)) if (e === !1) return !1;
			return !0;
		}), D = r(() => d.table.getAllColumns().map((e) => ({
			id: e.id,
			type: e.columnDef.meta?.type || "text"
		}))), O = r(() => d.subTableColumns ? d.subTableColumns.map((e) => ({
			id: e.accessorKey || e.id || e.header,
			type: e.meta?.type || e.columnDef?.meta?.type || "text"
		})) : null);
		return (r, c) => (y(), o("div", it, [s("div", at, [
			u(Ke, {
				table: n.table,
				"column-filters": n.columnFilters,
				"all-columns": D.value,
				"sub-table-columns": O.value,
				"sub-table-column-filters": n.subTableColumnFilters,
				"table-name": n.tableName,
				"onUpdate:columnFilters": c[0] ||= (e) => f("update:column-filters", e),
				"onUpdate:subTableColumnFilters": c[1] ||= (e) => f("update:sub-table-column-filters", e),
				class: "flex-1",
				style: g(n.isEmpty ? {
					opacity: .4,
					pointerEvents: "none"
				} : {})
			}, null, 8, [
				"table",
				"column-filters",
				"all-columns",
				"sub-table-columns",
				"sub-table-column-filters",
				"table-name",
				"style"
			]),
			s("button", {
				class: "p-1.5 rounded transition-colors",
				style: { color: "var(--st-text-secondary)" },
				disabled: n.loading,
				title: "Refresh",
				onClick: c[2] ||= (e) => f("refresh")
			}, [(y(), o("svg", {
				class: h(["w-4 h-4", n.loading ? "animate-spin" : ""]),
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [...c[22] ||= [s("path", { d: "M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" }, null, -1), s("path", { d: "M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z" }, null, -1)]], 2))], 8, ot),
			s("div", st, [
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
					style: g(n.isEmpty ? {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						opacity: .4,
						cursor: "default"
					} : C.value > 0 ? {
						border: "1px solid var(--st-accent-border)",
						color: "var(--st-accent)",
						backgroundColor: "var(--st-accent-bg)"
					} : {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					}),
					disabled: n.isEmpty,
					onClick: c[3] ||= (e) => !n.isEmpty && (p.value = !p.value)
				}, [c[23] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.5 2.5a.5.5 0 00-1 0v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L3.5 12.293V2.5zm4 .5a.5.5 0 010-1h1a.5.5 0 010 1h-1zm0 3a.5.5 0 010-1h3a.5.5 0 010 1h-3zm0 3a.5.5 0 010-1h5a.5.5 0 010 1h-5zm0 3a.5.5 0 010-1h7a.5.5 0 010 1h-7z" })], -1), C.value > 0 ? (y(), o(e, { key: 0 }, [l(" Sorted by " + w(C.value) + " rule" + w(C.value > 1 ? "s" : ""), 1)], 64)) : (y(), o(e, { key: 1 }, [l("Sort")], 64))], 12, ct),
				p.value ? (y(), i(fe, {
					key: 0,
					table: n.table,
					sorting: n.sorting,
					"all-columns": D.value,
					"sub-table-columns": O.value,
					"sub-table-sorting": n.subTableSorting,
					"table-name": n.tableName,
					"onUpdate:sorting": c[4] ||= (e) => f("update:sorting", e),
					"onUpdate:subTableSorting": c[5] ||= (e) => f("update:sub-table-sorting", e),
					onClose: c[6] ||= (e) => p.value = !1
				}, null, 8, [
					"table",
					"sorting",
					"all-columns",
					"sub-table-columns",
					"sub-table-sorting",
					"table-name"
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [p.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[7] ||= (e) => p.value = !1
				})) : a("", !0)]))
			]),
			n.toolbarActions.length > 0 ? (y(), o("div", lt, [
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
					style: g(n.isEmpty ? {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						opacity: .4,
						cursor: "default"
					} : {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					}),
					disabled: n.isEmpty,
					onClick: c[8] ||= (e) => !n.isEmpty && (v.value = !v.value)
				}, [
					c[24] ||= s("svg", {
						class: "w-3.5 h-3.5",
						viewBox: "0 0 16 16",
						fill: "currentColor"
					}, [s("path", { d: "M8 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" })], -1),
					l(" " + w(n.toolbarActionsLabel) + " ", 1),
					c[25] ||= s("svg", {
						class: "w-3 h-3 opacity-60",
						viewBox: "0 0 16 16",
						fill: "currentColor"
					}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)
				], 12, ut),
				v.value ? (y(), o("div", dt, [(y(!0), o(e, null, S(n.toolbarActions, (t, n) => (y(), o(e, { key: t.key ?? `divider-${n}` }, [t.divider ? (y(), o("div", ft)) : (y(), o("button", {
					key: 1,
					class: "w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2",
					style: g({
						color: "var(--st-text)",
						opacity: t.disabled ? .4 : 1,
						cursor: t.disabled ? "not-allowed" : "pointer"
					}),
					disabled: t.disabled,
					onClick: (e) => b(t)
				}, [t.icon ? (y(), o("span", {
					key: 0,
					class: "shrink-0 flex items-center",
					innerHTML: t.icon
				}, null, 8, mt)) : a("", !0), s("span", ht, w(t.label), 1)], 12, pt))], 64))), 128))])) : a("", !0),
				(y(), i(t, { to: "body" }, [v.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[9] ||= (e) => v.value = !1
				})) : a("", !0)]))
			])) : a("", !0),
			s("div", gt, [
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
					style: g(n.isEmpty ? {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						opacity: .4,
						cursor: "default"
					} : E.value ? {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					} : {
						border: "1px solid var(--st-accent-border)",
						color: "var(--st-accent)",
						backgroundColor: "var(--st-accent-bg)"
					}),
					disabled: n.isEmpty,
					onClick: c[10] ||= (e) => !n.isEmpty && (_.value = !_.value)
				}, [c[26] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zM1 3.5a.5.5 0 01.5-.5H5v10H1.5a.5.5 0 01-.5-.5v-9zM6 13V3h4v10H6zm5 0V3h3.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H11z" })], -1), E.value ? (y(), o(e, { key: 0 }, [l("Columns")], 64)) : (y(), o(e, { key: 1 }, [l(w(T.value) + " hidden", 1)], 64))], 12, _t),
				_.value ? (y(), i(rt, {
					key: 0,
					table: n.table,
					"column-visibility": n.columnVisibility,
					"default-column-visibility": n.defaultColumnVisibility,
					"sub-table-columns": O.value,
					"sub-table-column-visibility": n.subTableColumnVisibility,
					"table-name": n.tableName,
					"onUpdate:columnVisibility": c[11] ||= (e) => f("update:column-visibility", e),
					"onUpdate:subTableColumnVisibility": c[12] ||= (e) => f("update:sub-table-column-visibility", e),
					onClose: c[13] ||= (e) => _.value = !1
				}, null, 8, [
					"table",
					"column-visibility",
					"default-column-visibility",
					"sub-table-columns",
					"sub-table-column-visibility",
					"table-name"
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [_.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[14] ||= (e) => _.value = !1
				})) : a("", !0)]))
			]),
			n.editable.insert ? (y(), o("div", vt, [
				n.defaultInsertLabel ? (y(), o("div", yt, [s("button", {
					class: "flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[15] ||= (e) => f("insert-row")
				}, w(n.defaultInsertLabel), 1), s("button", {
					class: "flex items-center self-stretch px-1.5 rounded-r transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)",
						borderLeft: "1px solid var(--st-accent-hover)"
					},
					onClick: c[16] ||= (e) => m.value = !m.value
				}, [...c[27] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])])) : (y(), o("button", {
					key: 1,
					class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[17] ||= (e) => m.value = !m.value
				}, [...c[28] ||= [l(" Insert ", -1), s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])),
				m.value ? (y(), o("div", bt, [
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[18] ||= (e) => {
							f("insert-row"), m.value = !1;
						}
					}, " Insert row "),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[19] ||= (e) => m.value = !1
					}, " Insert column "),
					c[29] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[20] ||= (e) => m.value = !1
					}, " Import data from CSV ")
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [m.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[21] ||= (e) => m.value = !1
				})) : a("", !0)]))
			])) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-bb8e227e"]]), St = {
	class: "px-3 py-2 flex items-center gap-2",
	style: {
		borderBottom: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)"
	}
}, Ct = {
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, wt = { class: "relative" }, Tt = {
	key: 0,
	class: "absolute top-full left-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Et = ["onClick"], Dt = { class: "px-5 pt-5 pb-4" }, Ot = { style: { color: "var(--st-text-secondary)" } }, kt = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, At = /* @__PURE__ */ Se({
	__name: "SelectionToolbar",
	props: {
		selectedCount: {
			type: Number,
			required: !0
		},
		table: {
			type: Object,
			required: !0
		},
		editable: {
			type: Object,
			default: () => ({
				insert: !0,
				update: !0,
				delete: !0
			})
		},
		selectionActions: {
			type: Array,
			default: () => []
		},
		enableSelectAll: {
			type: Boolean,
			default: !0
		}
	},
	emits: ["delete-rows", "selection-action"],
	setup(n, { emit: c }) {
		let u = d("themeVars", {}), f = n, p = r(() => f.table.getFilteredRowModel().rows.length), m = r(() => f.selectedCount >= p.value), h = c, _ = x(!1), v = x(!1);
		function b() {
			return Object.keys(f.table.getState().rowSelection);
		}
		function C() {
			return f.table.getSelectedRowModel().rows.map((e) => e.original);
		}
		function E() {
			h("delete-rows", b()), v.value = !1;
		}
		function D(e) {
			let t = C(), n = "";
			if (e === "json") n = JSON.stringify(t, null, 2);
			else if (e === "csv") {
				let e = Object.keys(t[0] || {});
				n = [e.join(","), ...t.map((t) => e.map((e) => JSON.stringify(t[e] ?? "")).join(","))].join("\n");
			} else if (e === "sql") {
				let e = Object.keys(t[0] || {});
				n = t.map((t) => {
					let n = e.map((e) => {
						let n = t[e];
						return n === null ? "NULL" : typeof n == "string" ? `'${n.replace(/'/g, "''")}'` : String(n);
					});
					return `INSERT INTO table_name (${e.join(", ")}) VALUES (${n.join(", ")});`;
				}).join("\n");
			}
			navigator.clipboard.writeText(n), _.value = !1;
		}
		function O(e) {
			let t = C(), n = "", r = "", i = "";
			if (e === "json") n = JSON.stringify(t, null, 2), r = "application/json", i = "export.json";
			else if (e === "csv") {
				let e = Object.keys(t[0] || {});
				n = [e.join(","), ...t.map((t) => e.map((e) => JSON.stringify(t[e] ?? "")).join(","))].join("\n"), r = "text/csv", i = "export.csv";
			} else if (e === "tsv") {
				let e = Object.keys(t[0] || {});
				n = [e.join("	"), ...t.map((t) => e.map((e) => {
					let n = t[e] ?? "";
					return String(n).replace(/\t/g, " ");
				}).join("	"))].join("\n"), r = "text/tab-separated-values", i = "export.tsv";
			}
			let a = new Blob([n], { type: r }), o = URL.createObjectURL(a), s = document.createElement("a");
			s.href = o, s.download = i, s.click(), URL.revokeObjectURL(o), _.value = !1;
		}
		function k(e) {
			h("selection-action", e.key, C()), _.value = !1;
		}
		return (r, c) => (y(), o("div", St, [
			s("span", Ct, w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : "") + " selected", 1),
			n.editable.delete ? (y(), o("button", {
				key: 0,
				class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid rgba(239,68,68,0.4)",
					color: "#ef4444",
					"background-color": "rgba(239,68,68,0.1)"
				},
				onClick: c[0] ||= (e) => v.value = !0
			}, [...c[13] ||= [s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z" })], -1), l(" Delete... ", -1)]])) : a("", !0),
			s("div", wt, [
				s("button", {
					class: "flex items-center gap-1 px-2.5 py-1 rounded text-[13px] transition-colors",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					},
					onClick: c[1] ||= (e) => _.value = !_.value
				}, [...c[14] ||= [l(" Actions ", -1), s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]]),
				_.value ? (y(), o("div", Tt, [
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[2] ||= (e) => D("csv")
					}, "Copy as CSV"),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[3] ||= (e) => D("sql")
					}, "Copy as SQL"),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[4] ||= (e) => D("json")
					}, "Copy as JSON"),
					c[16] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[5] ||= (e) => O("csv")
					}, "Download as CSV"),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[6] ||= (e) => O("tsv")
					}, "Download as TSV"),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[7] ||= (e) => O("json")
					}, "Download as JSON"),
					n.selectionActions.length > 0 ? (y(), o(e, { key: 0 }, [c[15] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1), (y(!0), o(e, null, S(n.selectionActions, (e) => (y(), o("button", {
						key: e.key,
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: (t) => k(e)
					}, w(e.label), 9, Et))), 128))], 64)) : a("", !0)
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [_.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[8] ||= (e) => _.value = !1
				})) : a("", !0)]))
			]),
			s("button", {
				class: "text-[13px] transition-colors",
				style: { color: "var(--st-text-secondary)" },
				onClick: c[9] ||= (e) => n.table.toggleAllRowsSelected(!1)
			}, " Clear selection "),
			n.enableSelectAll && !m.value ? (y(), o("button", {
				key: 1,
				class: "text-[13px] transition-colors",
				style: { color: "var(--st-accent)" },
				onClick: c[10] ||= (e) => n.table.toggleAllRowsSelected(!0)
			}, " Select all " + w(p.value) + " item" + w(p.value === 1 ? "" : "s"), 1)) : a("", !0),
			c[18] ||= s("div", { class: "flex-1" }, null, -1),
			(y(), i(t, { to: "body" }, [v.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-50 flex items-center justify-center",
				style: g({ ...T(u) })
			}, [s("div", {
				class: "fixed inset-0",
				style: { backgroundColor: "var(--st-bg-overlay)" },
				onClick: c[11] ||= (e) => v.value = !1
			}), s("div", {
				class: "relative rounded-lg shadow-2xl w-96 text-[13px]",
				style: g({
					...T(u),
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)"
				})
			}, [s("div", Dt, [c[17] ||= s("h3", {
				class: "font-medium text-sm mb-2",
				style: { color: "var(--st-text)" }
			}, "Confirm deletion", -1), s("p", Ot, " Are you sure you want to delete " + w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : "") + "? This action cannot be undone. ", 1)]), s("div", kt, [s("button", {
				class: "px-3 py-1.5 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				onClick: c[12] ||= (e) => v.value = !1
			}, " Cancel "), s("button", {
				class: "px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium",
				onClick: E
			}, " Delete " + w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : ""), 1)])], 4)], 4)) : a("", !0)]))
		]));
	}
}, [["__scopeId", "data-v-7c6b7f3d"]]), jt = { class: "flex items-center gap-1.5 px-2 py-1.5 cursor-default overflow-hidden" }, Mt = {
	class: "shrink-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Nt = {
	key: 0,
	class: "text-xs font-normal truncate min-w-0",
	style: { color: "var(--st-text-tertiary)" }
}, Pt = {
	key: 1,
	class: "text-xs shrink-0",
	style: { color: "var(--st-accent)" }
}, Ft = {
	key: 2,
	class: "shrink-0 text-xs",
	style: { color: "var(--st-text-tertiary)" },
	title: "Column is frozen"
}, It = /* @__PURE__ */ Se({
	__name: "TableColumnHeader",
	props: {
		header: {
			type: Object,
			required: !0
		},
		table: {
			type: Object,
			required: !0
		}
	},
	setup(e) {
		let n = e, r = d("showDataTypes", !0), c = d("themeVars", {}), u = d("showRowBorders", !0), f = d("showColumnBorders", !0), p = x(!1), m = x({
			top: 0,
			left: 0
		}), _ = x(null), v = x(null), b = n.header.column.columnDef.meta || {};
		function S() {
			if (!p.value) {
				let e = v.value?.closest("th");
				if (e) {
					let t = e.getBoundingClientRect();
					m.value = {
						top: t.bottom + 2,
						left: t.left
					};
				}
			}
			p.value = !p.value;
		}
		function C() {
			p.value = !1;
		}
		function E() {
			n.header.column.toggleSorting(!1), C();
		}
		function D() {
			n.header.column.toggleSorting(!0), C();
		}
		function O() {
			navigator.clipboard.writeText(n.header.column.id), C();
		}
		function k() {
			b && (b.isFrozen = !b.isFrozen), C();
		}
		function A(e) {
			let t = n.header.getResizeHandler();
			t && t(e);
		}
		function j() {
			let e = n.header.column.id, t = _.value;
			if (!t) return;
			let r = t.closest("table");
			if (!r) return;
			let i = t.parentElement, a = Array.from(i.children).indexOf(t), o = document.createElement("span");
			o.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;font-size:13px;font-family:inherit;", document.body.appendChild(o);
			let s = 0, c = t.querySelector(".flex > span");
			c && (o.textContent = c.textContent, s = Math.max(s, o.offsetWidth)), r.querySelectorAll("tbody tr").forEach((e) => {
				let t = (e.querySelector(".contents-row") || e).children[a];
				t && (o.textContent = (t.querySelector(".truncate, .whitespace-pre-wrap") || t).textContent, s = Math.max(s, o.offsetWidth));
			}), document.body.removeChild(o);
			let l = Math.max(s + 32, 50);
			n.table.options.onColumnSizingChange((t) => ({
				...t,
				[e]: l
			}));
		}
		return (n, d) => (y(), o("th", {
			ref_key: "thRef",
			ref: _,
			class: "sticky top-0 z-[21] text-left font-normal select-none group/header",
			style: g({
				width: `${e.header.getSize()}px`,
				minWidth: `${e.header.getSize()}px`,
				backgroundColor: "var(--st-bg-header)",
				borderBottom: T(u) ? "1px solid var(--st-border)" : "none",
				borderRight: T(f) ? "1px solid var(--st-border)" : "none"
			})
		}, [
			s("div", jt, [
				s("span", Mt, [e.header.isPlaceholder ? a("", !0) : (y(), i(T(N), {
					key: 0,
					render: e.header.column.columnDef.header,
					props: e.header.getContext()
				}, null, 8, ["render", "props"]))]),
				T(r) ? (y(), o("span", Nt, w(T(b).type), 1)) : a("", !0),
				e.header.column.getIsSorted() ? (y(), o("span", Pt, w(e.header.column.getIsSorted() === "asc" ? "↑" : "↓"), 1)) : a("", !0),
				T(b).isFrozen ? (y(), o("span", Ft, "❄")) : a("", !0),
				s("button", {
					ref_key: "triggerRef",
					ref: v,
					class: h(["ml-auto shrink-0 w-4 h-4 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity", { "!opacity-100": p.value }]),
					style: { color: "var(--st-text-tertiary)" },
					onClick: M(S, ["stop"])
				}, [...d[1] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]], 2)
			]),
			(y(), i(t, { to: "body" }, [p.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-40",
				onClick: C
			})) : a("", !0), p.value ? (y(), o("div", {
				key: 1,
				class: "fixed w-52 rounded shadow-xl z-50 py-1 text-[13px]",
				style: g({
					...T(c),
					fontFamily: "var(--dt-font-family)",
					top: m.value.top + "px",
					left: m.value.left + "px",
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				}),
				onClick: d[0] ||= M(() => {}, ["stop"])
			}, [
				s("button", {
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: E
				}, [...d[2] ||= [s("span", {
					class: "w-4 text-center",
					style: { color: "var(--st-text-secondary)" }
				}, "↑", -1), l("Sort Ascending ", -1)]]),
				s("button", {
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: D
				}, [...d[3] ||= [s("span", {
					class: "w-4 text-center",
					style: { color: "var(--st-text-secondary)" }
				}, "↓", -1), l("Sort Descending ", -1)]]),
				d[6] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				s("button", {
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: O
				}, [...d[4] ||= [s("span", {
					class: "w-4 text-center",
					style: { color: "var(--st-text-secondary)" }
				}, [s("svg", {
					class: "w-3.5 h-3.5 inline",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" })])], -1), l(" Copy name ", -1)]]),
				s("button", {
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: k
				}, [d[5] ||= s("span", {
					class: "w-4 text-center",
					style: { color: "var(--st-text-secondary)" }
				}, "❄", -1), l(" " + w(T(b).isFrozen ? "Unfreeze column" : "Freeze column"), 1)])
			], 4)) : a("", !0)])),
			s("div", {
				class: h(["absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500", { "bg-blue-500": e.header.column.getIsResizing() }]),
				onMousedown: A,
				onTouchstart: A,
				onDblclick: M(j, ["stop"])
			}, null, 34)
		], 4));
	}
}, [["__scopeId", "data-v-08ae3151"]]), Lt = ["title"], Rt = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, zt = {
	key: 1,
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, Bt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, Vt = {
	class: "absolute -bottom-7 left-0 flex items-center gap-1 rounded shadow-lg px-2 py-1 z-20 text-xs whitespace-nowrap",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Ht = {
	key: 2,
	class: "flex items-center gap-2"
}, Ut = {
	class: "flex-1 rounded-full overflow-hidden",
	style: {
		height: "6px",
		backgroundColor: "var(--st-border-secondary)"
	}
}, Wt = {
	class: "text-xs shrink-0 tabular-nums",
	style: { color: "var(--st-text-secondary)" }
}, Gt = {
	class: "flex-1 min-w-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Kt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, qt = {
	key: 1,
	class: "block whitespace-pre-wrap break-words"
}, Jt = ["title"], Yt = ["title", "onClick"], Xt = ["innerHTML"], Zt = {
	key: 1,
	class: "text-[11px]"
}, Qt = {
	__name: "TableCell",
	props: {
		cell: {
			type: Object,
			required: !0
		},
		isSelected: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"select",
		"update",
		"editing-change"
	],
	setup(t, { emit: n }) {
		let i = t, c = d("editable", !0), u = d("showRowBorders", !0), p = d("showColumnBorders", !0), _ = d("cellButtonVisibility", "hover"), v = d("getCellPendingState", () => null), b = d("getCellPreviousValue", () => void 0), C = d("getRowPendingState", () => null), E = r(() => v(i.cell.row.id, i.cell.column.id)), D = r(() => C(i.cell.row.id)), k = r(() => b(i.cell.row.id, i.cell.column.id)), A = r(() => E.value === "modified"), N = r(() => D.value === "delete"), P = r(() => {
			let e = f(_) ? _.value : _;
			return e === "always" ? "opacity-100" : e === "select" ? i.isSelected ? "opacity-100" : "opacity-0" : "opacity-0 group-hover/cell:opacity-100";
		}), F = n, I = x(!1), L = x(""), R = x(null), z = i.cell.column.columnDef.meta || {}, ee = z.type === "boolean", B = r(() => {
			if (!z.progressBar) return null;
			let e = i.cell.getValue();
			if (e == null) return null;
			if (typeof z.progressBar == "function") return Math.min(100, Math.max(0, z.progressBar(e, i.cell.row.original)));
			if (typeof z.progressBar == "object" && z.progressBar !== null) {
				let { min: t = 0, max: n = 100 } = z.progressBar;
				return Math.min(100, Math.max(0, (e - t) / (n - t) * 100));
			}
			return Math.min(100, Math.max(0, Number(e)));
		}), V = !!z.multiline, H = z.cellButtons ?? [];
		function U() {
			I.value || F("select");
		}
		function W() {
			!c.value?.update || ee || z.progressBar || H.length > 0 || (I.value = !0, F("editing-change", !0), L.value = i.cell.getValue() ?? "", m(() => {
				R.value && (R.value.focus(), R.value.select(), G());
			}));
		}
		function G() {
			R.value && (R.value.style.height = "auto", R.value.style.height = R.value.scrollHeight + "px");
		}
		function K() {
			F("update", z.type === "int8" || z.type === "int4" || z.type === "float8" ? Number(L.value) : L.value), I.value = !1, F("editing-change", !1);
		}
		function q() {
			I.value = !1, F("editing-change", !1);
		}
		function te(e) {
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), K()) : e.key === "Escape" && q();
		}
		function J() {
			c.value?.update && F("update", !i.cell.getValue());
		}
		return (n, r) => (y(), o("div", {
			class: "px-2 py-1.5 relative cursor-default group/cell align-middle",
			style: g({
				display: "table-cell",
				width: `${t.cell.column.getSize()}px`,
				minWidth: `${t.cell.column.getSize()}px`,
				maxWidth: `${t.cell.column.getSize()}px`,
				borderBottom: T(u) ? "1px solid var(--st-border)" : "none",
				borderRight: T(p) ? "1px solid var(--st-border)" : "none",
				boxShadow: t.isSelected && !I.value ? "inset 0 0 0 2px var(--st-accent)" : A.value ? "inset 3px 0 0 var(--st-accent)" : "none",
				zIndex: I.value ? 20 : t.isSelected ? 10 : "auto"
			}),
			title: A.value && k.value !== void 0 ? `Was: ${k.value === null || k.value === "" ? "(empty)" : k.value}` : void 0,
			onClick: U,
			onDblclick: W
		}, [ee ? (y(), o(e, { key: 0 }, [T(c).update ? (y(), o("button", {
			key: 0,
			class: "flex items-center gap-1.5",
			onClick: M(J, ["stop"])
		}, [s("span", {
			class: "inline-block w-7 h-4 rounded-full relative transition-colors",
			style: g({ backgroundColor: t.cell.getValue() ? "var(--st-accent)" : "var(--st-toggle-off)" })
		}, [s("span", { class: h(["absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", t.cell.getValue() ? "left-3.5" : "left-0.5"]) }, null, 2)], 4), s("span", Rt, w(t.cell.getValue() ? "true" : "false"), 1)])) : (y(), o("span", zt, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Bt, "NULL")) : (y(), o(e, { key: 1 }, [l(w(t.cell.getValue() ? "true" : "false"), 1)], 64))]))], 64)) : I.value ? (y(), o(e, { key: 1 }, [j(s("textarea", {
			ref_key: "textareaRef",
			ref: R,
			"onUpdate:modelValue": r[0] ||= (e) => L.value = e,
			class: "w-full rounded px-1.5 py-1 text-[13px] resize-none outline-none",
			style: {
				backgroundColor: "var(--st-bg-input)",
				color: "var(--st-text)",
				border: "1px solid var(--st-accent)"
			},
			rows: "1",
			onKeydown: te,
			onInput: G
		}, null, 544), [[O, L.value]]), s("div", Vt, [
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-accent)" },
				onClick: M(K, ["stop"])
			}, " ↵ Save "),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-text-secondary)" },
				onClick: M(q, ["stop"])
			}, " Esc Cancel ")
		])], 64)) : B.value === null ? (y(), o("div", {
			key: 3,
			class: "flex items-start gap-1 min-w-0",
			style: g(N.value ? {
				textDecoration: "line-through",
				opacity: .5
			} : {})
		}, [s("div", Gt, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Kt, "NULL")) : V ? (y(), o("span", qt, w(t.cell.getValue()), 1)) : (y(), o("span", {
			key: 2,
			class: "truncate block",
			title: String(t.cell.getValue())
		}, w(t.cell.getValue()), 9, Jt))]), T(H).length > 0 ? (y(), o("div", {
			key: 0,
			class: h(["flex items-center gap-0.5 shrink-0 transition-opacity", P.value])
		}, [(y(!0), o(e, null, S(T(H), (e) => (y(), o("button", {
			key: e.label,
			class: "flex items-center justify-center w-5 h-5 rounded transition-colors",
			style: { color: "var(--st-text-secondary)" },
			title: e.label,
			onClick: M((n) => e.onClick(t.cell.row.original), ["stop"])
		}, [e.icon ? (y(), o("span", {
			key: 0,
			class: "w-3.5 h-3.5 flex items-center justify-center",
			innerHTML: e.icon
		}, null, 8, Xt)) : (y(), o("span", Zt, w(e.label), 1))], 8, Yt))), 128))], 2)) : a("", !0)], 4)) : (y(), o("div", Ht, [s("div", Ut, [s("div", {
			class: "h-full rounded-full transition-all duration-300",
			style: g({
				width: `${B.value}%`,
				backgroundColor: "var(--st-accent)"
			})
		}, null, 4)]), s("span", Wt, w(Math.round(B.value)) + "% ", 1)]))], 44, Lt));
	}
}, $t = ["checked", "indeterminate"], en = ["data-index"], tn = { style: {
	display: "table",
	tableLayout: "fixed",
	width: "100%"
} }, nn = { class: "flex items-center justify-end pr-1.5 pl-0.5 h-full" }, rn = ["onClick"], an = ["onClick"], on = {
	class: "text-xs text-right flex-1",
	style: { color: "var(--st-text-tertiary)" }
}, sn = ["checked", "onClick"], cn = {
	key: 0,
	class: "absolute inset-0 flex items-center justify-center pointer-events-none",
	style: { top: "33px" }
}, ln = { class: "flex flex-col items-center gap-4 text-center px-6 pointer-events-auto" }, un = {
	class: "flex items-center justify-center w-14 h-14 rounded-2xl",
	style: {
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, dn = {
	class: "w-7 h-7",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { color: "var(--st-accent)" }
}, fn = { class: "flex flex-col gap-1" }, pn = {
	class: "font-semibold text-[15px]",
	style: { color: "var(--st-text)" }
}, mn = {
	class: "text-[13px] max-w-xs leading-relaxed",
	style: { color: "var(--st-text-tertiary)" }
}, hn = {
	key: 0,
	class: "relative mt-1"
}, gn = {
	key: 0,
	class: "flex items-center"
}, _n = {
	key: 2,
	class: "absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, vn = /* @__PURE__ */ Se({
	__name: "TableGrid",
	props: { table: {
		type: Object,
		required: !0
	} },
	emits: [
		"update-cell",
		"context-menu",
		"edit-row"
	],
	setup(n, { emit: c }) {
		let f = n, m = d("editable", !0), _ = d("showRowBorders", !0), v = d("showColumnBorders", !0), b = d("emptyTitle", "No rows found"), C = d("emptyMessage", "Get started by inserting a new row."), D = d("openInsertPanel", null), O = d("defaultInsertLabel", null), k = d("insertRow", () => {}), A = x(!1), j = d("expanded", x({})), N = d("toggleRowExpanded", () => {}), P = d("getSubTable", null), F = d("nestingDepth", 0), I = d("parentTheme", "dark"), L = d("parentAccentColor", "#3ecf8e"), R = d("subTableSorting", x([])), ee = d("subTableColumnFilters", x([])), B = d("subTableColumnVisibility", x({})), V = d("getRowPendingState", () => null), H = c, U = x(null), W = x(null), G = r(() => f.table.getHeaderGroups()), K = r(() => 84 + f.table.getVisibleLeafColumns().reduce((e, t) => e + t.getSize(), 0)), q = r(() => f.table.getRowModel().rows), te = r(() => f.table.getState().pagination), J = r(() => f.table.getIsAllPageRowsSelected()), ne = r(() => f.table.getIsSomePageRowsSelected());
		function re(e, t) {
			U.value = `${e}:${t}`;
		}
		function Y() {
			U.value = null;
		}
		function ie(e, t, n) {
			H("context-menu", e, t, n);
		}
		function ae() {
			f.table.toggleAllPageRowsSelected(!J.value);
		}
		let oe = x(null);
		function se(e, t, n) {
			if (t?.shiftKey && oe.value !== null) {
				let e = Math.min(oe.value, n), t = Math.max(oe.value, n), r = q.value;
				for (let n = e; n <= t; n++) r[n].toggleSelected(!0);
			} else e.toggleSelected(!e.getIsSelected());
			oe.value = n;
		}
		let X = r(() => {
			let e = v ? "inset -1px 0 0 var(--st-border)" : "", t = "2px 0 4px var(--st-shadow-sticky)";
			return e ? `${e}, ${t}` : t;
		}), ce = r(() => {
			if (!P) return {};
			let e = {};
			for (let t of q.value) {
				let n = P(t.original);
				n && (e[t.id] = n);
			}
			return e;
		});
		function le(e) {
			return !!ce.value[e.id];
		}
		function ue(e) {
			return !!j.value[e.id];
		}
		let de = E("scroller"), fe = z(r(() => ({
			count: q.value.length,
			getScrollElement: () => de.value,
			estimateSize: () => 33,
			overscan: 8,
			getItemKey: (e) => q.value[e]?.id ?? e
		}))), pe = r(() => fe.value.getVirtualItems()), me = r(() => fe.value.getTotalSize());
		return (r, c) => (y(), o("div", { class: h(T(F) === 0 ? "flex-1 min-h-0 relative" : "overflow-auto") }, [s("div", {
			ref: "scroller",
			class: h(T(F) === 0 ? "absolute inset-0 overflow-auto flex flex-col" : "flex flex-col"),
			onClick: M(Y, ["self"])
		}, [s("table", {
			class: "border-collapse table-fixed shrink-0",
			style: g({
				width: K.value + "px",
				backgroundColor: "var(--st-bg-header)"
			})
		}, [s("thead", null, [(y(!0), o(e, null, S(G.value, (t) => (y(), o("tr", { key: t.id }, [
			s("th", {
				class: "px-1.5 py-1.5 text-right font-normal sticky top-0 left-0 z-[40]",
				style: g({
					width: "44px",
					minWidth: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: T(_) ? "1px solid var(--st-border)" : "none",
					color: "var(--st-text-tertiary)"
				})
			}, [...c[7] ||= [s("span", { class: "text-xs" }, "#", -1)]], 4),
			s("th", {
				class: "px-1 py-1.5 text-center align-middle sticky top-0 z-[39]",
				style: g({
					width: "40px",
					minWidth: "40px",
					left: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: T(_) ? "1px solid var(--st-border)" : "none",
					boxShadow: X.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: J.value,
				indeterminate: ne.value,
				title: "Select all rows on this page",
				onChange: ae
			}, null, 40, $t)], 4),
			(y(!0), o(e, null, S(t.headers, (e) => (y(), i(It, {
				key: e.id,
				header: e,
				table: n.table
			}, null, 8, ["header", "table"]))), 128))
		]))), 128))])], 4), s("div", { style: g({
			position: "relative",
			height: me.value + "px",
			width: K.value + "px"
		}) }, [(y(!0), o(e, null, S(pe.value, (t) => (y(), o("div", {
			key: t.key,
			ref_for: !0,
			ref: (e) => e && T(fe).measureElement(e),
			"data-index": t.index,
			class: h(["st-row group", {
				"st-row--selected": q.value[t.index].getIsSelected(),
				"st-row--pending-insert": T(V)(q.value[t.index].id) === "insert",
				"st-row--pending-delete": T(V)(q.value[t.index].id) === "delete"
			}]),
			style: g({
				position: "absolute",
				top: "0px",
				left: "0px",
				width: "100%",
				transform: `translateY(${t.start}px)`,
				zIndex: W.value === q.value[t.index].id ? 5 : "auto"
			})
		}, [s("div", tn, [
			s("div", {
				class: "py-1.5 align-middle sticky left-0 z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "44px",
					minWidth: "44px",
					borderBottom: T(_) ? "1px solid var(--st-border)" : "none"
				})
			}, [s("div", nn, [le(q.value[t.index]) ? (y(), o("button", {
				key: 0,
				class: "flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150",
				style: g({
					color: ue(q.value[t.index]) ? "var(--st-accent)" : "var(--st-text-secondary)",
					transform: ue(q.value[t.index]) ? "rotate(90deg)" : "rotate(0deg)"
				}),
				title: "Toggle sub-table",
				onClick: M((e) => T(N)(q.value[t.index].id), ["stop"])
			}, [...c[8] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6 3l5 5-5 5V3z" })], -1)]], 12, rn)) : T(m).update ? (y(), o("button", {
				key: 1,
				class: "invisible group-hover:visible flex items-center justify-center w-4 h-4 shrink-0",
				style: { color: "var(--st-text-secondary)" },
				title: "Expand row",
				onClick: M((e) => H("edit-row", q.value[t.index].original), ["stop"])
			}, [...c[9] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2"
			}, [s("path", { d: "M6 2h8v8M14 2L6 10" })], -1)]], 8, an)) : a("", !0), s("span", on, w(te.value.pageIndex * te.value.pageSize + t.index + 1), 1)])], 4),
			s("div", {
				class: "px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "40px",
					minWidth: "40px",
					left: "44px",
					borderBottom: T(_) ? "1px solid var(--st-border)" : "none",
					boxShadow: X.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: q.value[t.index].getIsSelected(),
				onClick: (e) => se(q.value[t.index], e, t.index)
			}, null, 8, sn)], 4),
			(y(!0), o(e, null, S(q.value[t.index].getVisibleCells(), (e) => (y(), i(Qt, {
				key: e.id,
				cell: e,
				"is-selected": U.value === `${q.value[t.index].id}:${e.column.id}`,
				onSelect: (n) => re(q.value[t.index].id, e.column.id),
				onUpdate: (n) => H("update-cell", q.value[t.index].id, e.column.id, n),
				onEditingChange: (e) => W.value = e ? q.value[t.index].id : null,
				onContextmenu: M((n) => ie(n, q.value[t.index], e), ["prevent"])
			}, null, 8, [
				"cell",
				"is-selected",
				"onSelect",
				"onUpdate",
				"onEditingChange",
				"onContextmenu"
			]))), 128))
		]), ue(q.value[t.index]) ? (y(), o("div", {
			key: 0,
			style: g({
				display: "block",
				width: K.value + "px",
				borderBottom: T(_) ? "1px solid var(--st-border)" : "none"
			})
		}, [s("div", { style: g({
			borderLeft: "3px solid var(--st-accent)",
			marginLeft: 10 + T(F) * 16 + "px",
			backgroundColor: "var(--st-bg)"
		}) }, [u(xr, p({ ref_for: !0 }, ce.value[q.value[t.index].id], {
			theme: ce.value[q.value[t.index].id].theme ?? T(I),
			"accent-color": ce.value[q.value[t.index].id].accentColor ?? T(L),
			"nesting-depth": T(F) + 1,
			"controlled-sorting": T(R),
			"controlled-column-filters": T(ee),
			"controlled-column-visibility": T(B)
		}), null, 16, [
			"theme",
			"accent-color",
			"nesting-depth",
			"controlled-sorting",
			"controlled-column-filters",
			"controlled-column-visibility"
		])], 4)], 4)) : a("", !0)], 14, en))), 128))], 4)], 2), q.value.length === 0 ? (y(), o("div", cn, [s("div", ln, [
			s("div", un, [(y(), o("svg", dn, [...c[10] ||= [s("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}, null, -1), s("path", { d: "M3 9h18M3 15h18M9 9v9M15 9v9" }, null, -1)]]))]),
			s("div", fn, [s("p", pn, w(T(b)), 1), s("p", mn, w(T(C)), 1)]),
			T(m).insert ? (y(), o("div", hn, [
				T(O) ? (y(), o("div", gn, [s("button", {
					class: "flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[0] ||= (e) => T(k)()
				}, w(T(O)), 1), s("button", {
					class: "flex items-center self-stretch px-1.5 rounded-r transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)",
						borderLeft: "1px solid var(--st-accent-hover)"
					},
					onClick: c[1] ||= (e) => A.value = !A.value
				}, [...c[11] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])])) : (y(), o("button", {
					key: 1,
					class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[2] ||= (e) => A.value = !A.value
				}, [...c[12] ||= [l(" Insert ", -1), s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])),
				A.value ? (y(), o("div", _n, [
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[3] ||= (e) => {
							T(D)(), A.value = !1;
						}
					}, " Insert row "),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[4] ||= (e) => A.value = !1
					}, " Insert column "),
					c[13] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[5] ||= (e) => A.value = !1
					}, " Import data from CSV ")
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [A.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[6] ||= (e) => A.value = !1
				})) : a("", !0)]))
			])) : a("", !0)
		])])) : a("", !0)], 2));
	}
}, [["__scopeId", "data-v-92e4bbbd"]]), yn = {
	class: "px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0",
	style: {
		borderTop: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)",
		color: "var(--st-text-secondary)"
	}
}, bn = ["disabled"], xn = { class: "flex items-center gap-1.5" }, Sn = ["value", "max"], Cn = {
	key: 1,
	class: "tabular-nums",
	style: { color: "var(--st-text)" }
}, wn = ["disabled"], Tn = { class: "flex items-center gap-1.5" }, En = ["value"], Dn = {
	class: "tabular-nums px-2 py-0.5 rounded",
	style: {
		color: "var(--st-accent)",
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, On = ["disabled"], kn = ["disabled"], An = {
	key: 0,
	class: "w-3 h-3 animate-spin",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2"
}, jn = { style: { color: "var(--st-text-tertiary)" } }, Mn = {
	class: "rounded-lg shadow-xl p-5 w-80",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)",
		color: "var(--st-text)"
	}
}, Nn = {
	class: "text-[13px] mb-4",
	style: { color: "var(--st-text-secondary)" }
}, Pn = { class: "flex items-center justify-end gap-2" }, Fn = {
	__name: "TablePagination",
	props: {
		table: {
			type: Object,
			required: !0
		},
		totalCount: {
			type: Number,
			default: null
		},
		hasRandomAccess: {
			type: Boolean,
			default: !0
		},
		stagedEdits: {
			type: Boolean,
			default: !1
		},
		pendingEditCount: {
			type: Number,
			default: 0
		},
		committing: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["commit", "discard"],
	setup(n, { emit: c }) {
		let u = n, d = c, f = r(() => u.table.getState().pagination.pageIndex), p = r(() => u.table.getState().pagination.pageSize), m = r(() => u.table.getPageCount()), h = r(() => u.totalCount === null ? u.table.getFilteredRowModel().rows.length : u.totalCount);
		function g(e) {
			let t = Math.max(0, Math.min(e, m.value - 1));
			u.table.setPageIndex(t);
		}
		function _(e) {
			let t = parseInt(e.target.value, 10);
			isNaN(t) || g(t - 1);
		}
		let v = x(!1);
		function b() {
			u.pendingEditCount !== 0 && (v.value = !0);
		}
		function S() {
			d("discard"), v.value = !1;
		}
		return (r, c) => (y(), o("div", yn, [
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !n.table.getCanPreviousPage(),
				onClick: c[0] ||= (e) => n.table.previousPage()
			}, [...c[6] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" })], -1)]], 8, bn),
			s("div", xn, [
				c[7] ||= s("span", null, "Page", -1),
				n.hasRandomAccess ? (y(), o("input", {
					key: 0,
					type: "number",
					value: f.value + 1,
					min: "1",
					max: m.value,
					class: "w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					style: {
						backgroundColor: "var(--st-bg-input)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					},
					onChange: _
				}, null, 40, Sn)) : (y(), o("span", Cn, w(f.value + 1), 1)),
				s("span", null, "of " + w(m.value), 1)
			]),
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !n.table.getCanNextPage(),
				onClick: c[1] ||= (e) => n.table.nextPage()
			}, [...c[8] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" })], -1)]], 8, wn),
			c[14] ||= s("div", {
				class: "w-px h-4 mx-1",
				style: { backgroundColor: "var(--st-border)" }
			}, null, -1),
			s("div", Tn, [c[10] ||= s("span", null, "Rows per page:", -1), s("select", {
				value: p.value,
				class: "rounded px-1.5 py-0.5 text-[13px] outline-none cursor-pointer",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				},
				onChange: c[2] ||= (e) => n.table.setPageSize(Number(e.target.value))
			}, [...c[9] ||= [
				s("option", { value: 100 }, "100", -1),
				s("option", { value: 500 }, "500", -1),
				s("option", { value: 1e3 }, "1000", -1)
			]], 40, En)]),
			c[15] ||= s("div", { class: "flex-1" }, null, -1),
			n.stagedEdits && n.pendingEditCount > 0 ? (y(), o(e, { key: 0 }, [
				s("span", Dn, w(n.pendingEditCount) + " pending change" + w(n.pendingEditCount === 1 ? "" : "s"), 1),
				s("button", {
					class: "px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						backgroundColor: "transparent"
					},
					disabled: n.committing,
					onClick: b
				}, " Clear edits ", 8, On),
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					disabled: n.committing,
					onClick: c[3] ||= (e) => d("commit")
				}, [n.committing ? (y(), o("svg", An, [...c[11] ||= [s("path", {
					d: "M8 1.5a6.5 6.5 0 1 1-6.5 6.5",
					"stroke-linecap": "round"
				}, null, -1)]])) : a("", !0), l(" " + w(n.committing ? "Committing…" : "Commit"), 1)], 8, kn),
				c[12] ||= s("div", {
					class: "w-px h-4 mx-1",
					style: { backgroundColor: "var(--st-border)" }
				}, null, -1)
			], 64)) : a("", !0),
			s("span", jn, w(h.value.toLocaleString()) + " record" + w(h.value === 1 ? "" : "s"), 1),
			(y(), i(t, { to: "body" }, [v.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-[100] flex items-center justify-center",
				style: { backgroundColor: "var(--st-bg-overlay)" },
				onClick: c[5] ||= M((e) => v.value = !1, ["self"])
			}, [s("div", Mn, [
				c[13] ||= s("h3", { class: "font-semibold text-[14px] mb-2" }, "Clear all pending edits?", -1),
				s("p", Nn, " This will discard " + w(n.pendingEditCount) + " pending change" + w(n.pendingEditCount === 1 ? "" : "s") + ". This action cannot be undone. ", 1),
				s("div", Pn, [s("button", {
					class: "px-3 py-1 rounded text-[13px]",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					},
					onClick: c[4] ||= (e) => v.value = !1
				}, " Cancel "), s("button", {
					class: "px-3 py-1 rounded text-[13px] font-medium",
					style: {
						"background-color": "#ef4444",
						color: "white"
					},
					onClick: S
				}, " Clear edits ")])
			])])) : a("", !0)]))
		]));
	}
}, In = {
	class: "px-5 py-4 flex items-center justify-between",
	style: { borderBottom: "1px solid var(--st-border)" }
}, Ln = { class: "flex items-center gap-2" }, Rn = {
	class: "text-sm",
	style: { color: "var(--st-text)" }
}, zn = {
	class: "rounded px-2 py-0.5 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-input)",
		border: "1px solid var(--st-border-secondary)",
		color: "var(--st-text-secondary)"
	}
}, Bn = { class: "flex-1 overflow-auto px-5 py-4" }, Vn = {
	key: 0,
	class: "mb-6"
}, Hn = { class: "flex items-start gap-4" }, Un = { class: "w-40 shrink-0 pt-2" }, Wn = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, Gn = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, Kn = { class: "flex-1" }, qn = ["disabled", "onClick"], Jn = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, Yn = ["value"], Xn = ["onUpdate:modelValue", "placeholder"], Zn = { key: 1 }, Qn = { class: "flex items-start gap-4" }, $n = { class: "w-40 shrink-0 pt-2" }, er = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, tr = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, nr = { class: "flex-1" }, rr = ["disabled", "onClick"], ir = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, ar = ["value"], or = ["onUpdate:modelValue", "placeholder"], sr = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border)" }
}, cr = {
	__name: "RowEditPanel",
	props: {
		mode: {
			type: String,
			required: !0
		},
		rowData: {
			type: Object,
			default: null
		},
		table: {
			type: Object,
			required: !0
		},
		tableName: {
			type: String,
			default: "table"
		}
	},
	emits: ["save", "close"],
	setup(t, { emit: n }) {
		let i = d("themeVars", {}), l = t, u = n, f = r(() => l.table.getAllColumns().map((e) => ({
			id: e.id,
			meta: e.columnDef.meta || {}
		}))), p = r(() => l.mode === "insert" ? f.value.filter((e) => e.meta.insertable !== !1) : f.value), m = r(() => p.value.filter((e) => e.meta.isNullable === !1)), b = r(() => p.value.filter((e) => e.meta.isNullable !== !1)), C = x({});
		function E() {
			let e = {};
			f.value.forEach((t) => {
				l.mode === "update" && l.rowData ? e[t.id] = l.rowData[t.id] ?? "" : t.meta.defaultValue === void 0 ? e[t.id] = t.meta.type === "boolean" ? !1 : "" : e[t.id] = t.meta.defaultValue;
			}), C.value = e;
		}
		E();
		function D() {
			let e = { ...C.value };
			f.value.forEach((t) => {
				[
					"int8",
					"int4",
					"float8"
				].includes(t.meta.type) && e[t.id] !== "" && (e[t.id] = Number(e[t.id]));
			}), u("save", e);
		}
		function k(e) {
			e.key === "Escape" ? u("close") : (e.metaKey || e.ctrlKey) && e.key === "Enter" && D();
		}
		return _(() => {
			document.addEventListener("keydown", k);
		}), v(() => {
			document.removeEventListener("keydown", k);
		}), (n, r) => (y(), o("div", {
			class: "w-[420px] shrink-0 flex flex-col shadow-2xl overflow-hidden",
			style: g({
				...T(i),
				backgroundColor: "var(--st-bg)",
				borderLeft: "1px solid var(--st-border)"
			})
		}, [
			s("div", In, [s("div", Ln, [s("span", Rn, w(t.mode === "insert" ? "Insert row into" : "Update row from"), 1), s("code", zn, w(t.tableName), 1)]), s("button", {
				class: "w-6 h-6 flex items-center justify-center",
				style: { color: "var(--st-text-tertiary)" },
				onClick: r[0] ||= (e) => u("close")
			}, [...r[2] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])]),
			s("div", Bn, [m.value.length > 0 ? (y(), o("div", Vn, [(y(!0), o(e, null, S(m.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", Hn, [s("div", Un, [s("div", Wn, w(n.id), 1), s("div", Gn, w(n.meta.type), 1)]), s("div", Kn, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (C.value[n.id] = !C.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: C.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", C.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", Jn, w(C.value[n.id] ? "true" : "false"), 1)], 10, qn)) : (y(), o(e, { key: 1 }, [n.meta.isPrimaryKey && t.mode === "update" || n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: C.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, Yn)) : j((y(), o("textarea", {
				key: 1,
				"onUpdate:modelValue": (e) => C.value[n.id] = e,
				class: "w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				},
				rows: "1",
				placeholder: n.meta.placeholder ?? ""
			}, null, 8, Xn)), [[O, C.value[n.id]]])], 64))])])]))), 128))])) : a("", !0), b.value.length > 0 ? (y(), o("div", Zn, [r[3] ||= s("div", { class: "mb-3" }, [s("h3", {
				class: "text-sm font-medium",
				style: { color: "var(--st-text)" }
			}, "Optional Fields"), s("p", {
				class: "text-xs mt-0.5",
				style: { color: "var(--st-text-tertiary)" }
			}, "These are columns that do not need any value")], -1), (y(!0), o(e, null, S(b.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", Qn, [s("div", $n, [s("div", er, w(n.id), 1), s("div", tr, w(n.meta.type), 1)]), s("div", nr, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (C.value[n.id] = !C.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: C.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", C.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", ir, w(C.value[n.id] ? "true" : "false"), 1)], 10, rr)) : (y(), o(e, { key: 1 }, [n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: C.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, ar)) : j((y(), o("textarea", {
				key: 1,
				"onUpdate:modelValue": (e) => C.value[n.id] = e,
				class: "w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				},
				rows: "1",
				placeholder: n.meta.placeholder ?? "NULL"
			}, null, 8, or)), [[O, C.value[n.id]]])], 64))])])]))), 128))])) : a("", !0)]),
			s("div", sr, [s("button", {
				class: "px-3 py-1.5 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				onClick: r[1] ||= (e) => u("close")
			}, " Cancel "), s("button", {
				class: "px-3 py-1.5 rounded text-[13px] font-medium transition-colors flex items-center gap-1.5",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: D
			}, [...r[4] ||= [c(" Save <span class=\"opacity-60 flex items-center gap-0.5\"><svg viewBox=\"0 0 24 24\" class=\"w-3 h-3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3\"></path></svg><svg viewBox=\"0 0 24 24\" class=\"w-3 h-3\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"9 10 4 15 9 20\"></polyline><path d=\"M20 4v7a4 4 0 0 1-4 4H4\"></path></svg></span>", 2)]])])
		], 4));
	}
}, lr = {
	class: "w-52 rounded shadow-xl py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, ur = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, dr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, fr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, pr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, mr = /* @__PURE__ */ Se({
	__name: "ContextMenu",
	props: {
		x: {
			type: Number,
			required: !0
		},
		y: {
			type: Number,
			required: !0
		},
		row: {
			type: Object,
			default: null
		},
		cell: {
			type: Object,
			default: null
		}
	},
	emits: [
		"close",
		"edit-row",
		"delete-row",
		"filter-by-value",
		"undo-row",
		"undo-cell"
	],
	setup(n, { emit: c }) {
		let u = d("editable", !0), f = d("themeVars", {}), p = d("getRowPendingState", () => null), m = d("getCellPendingState", () => null), h = n, b = c, S = r(() => h.row ? p(h.row.id) : null), C = r(() => h.row && h.cell ? m(h.row.id, h.cell.column.id) : null), E = r(() => S.value === "insert" ? "Discard new row" : S.value === "delete" ? "Restore row" : S.value === "update" ? "Undo row changes" : null), D = x(null), O = r(() => h.cell ? h.cell.getValue() : null), k = r(() => h.cell ? h.cell.column.id : null);
		function A(e) {
			if (navigator.clipboard && document.hasFocus()) navigator.clipboard.writeText(e);
			else {
				let t = document.createElement("textarea");
				t.value = e, t.style.cssText = "position:fixed;opacity:0;pointer-events:none", document.body.appendChild(t), t.focus(), t.select(), document.execCommand("copy"), document.body.removeChild(t);
			}
		}
		function j() {
			O.value !== null && O.value !== void 0 && A(String(O.value)), b("close");
		}
		function M() {
			h.row && A(JSON.stringify(h.row.original, null, 2)), b("close");
		}
		function N() {
			k.value && O.value !== null && O.value !== void 0 && b("filter-by-value", k.value, String(O.value)), b("close");
		}
		function P() {
			b("edit-row"), b("close");
		}
		function F() {
			b("delete-row"), b("close");
		}
		function I() {
			b("undo-row"), b("close");
		}
		function L() {
			k.value && b("undo-cell", k.value), b("close");
		}
		ee(D, () => {
			b("close");
		});
		function R(e) {
			e.key === "Escape" && b("close");
		}
		_(() => {
			document.addEventListener("keydown", R);
		}), v(() => {
			document.removeEventListener("keydown", R);
		});
		let z = r(() => ({
			position: "fixed",
			left: `${h.x}px`,
			top: `${h.y}px`,
			zIndex: 9999
		}));
		return (n, r) => (y(), i(t, { to: "body" }, [s("div", {
			ref_key: "menuRef",
			ref: D,
			style: g({
				...T(f),
				...z.value
			})
		}, [s("div", lr, [
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: j
			}, [(y(), o("svg", ur, [...r[0] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), r[1] ||= l(" Copy cell ", -1)]),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: M
			}, [(y(), o("svg", dr, [...r[2] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), r[3] ||= l(" Copy row ", -1)]),
			r[13] ||= s("div", {
				class: "my-1",
				style: { borderTop: "1px solid var(--st-border-secondary)" }
			}, null, -1),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: N
			}, [(y(), o("svg", fr, [...r[4] ||= [s("path", { d: "M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" }, null, -1)]])), r[5] ||= l(" Filter by value ", -1)]),
			C.value === "modified" || E.value ? (y(), o(e, { key: 0 }, [
				r[8] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				C.value === "modified" ? (y(), o("button", {
					key: 0,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-accent)" },
					onClick: L
				}, [...r[6] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [s("path", { d: "M3 7h7a4 4 0 0 1 0 8H6" }), s("path", { d: "M6 4L3 7l3 3" })], -1), l(" Undo cell change ", -1)]])) : a("", !0),
				E.value ? (y(), o("button", {
					key: 1,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-accent)" },
					onClick: I
				}, [r[7] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [s("path", { d: "M3 7h7a4 4 0 0 1 0 8H6" }), s("path", { d: "M6 4L3 7l3 3" })], -1), l(" " + w(E.value), 1)])) : a("", !0)
			], 64)) : a("", !0),
			T(u).update || T(u).delete ? (y(), o(e, { key: 1 }, [
				r[12] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				T(u).update ? (y(), o("button", {
					key: 0,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: P
				}, [(y(), o("svg", pr, [...r[9] ||= [s("path", { d: "M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z" }, null, -1)]])), r[10] ||= l(" Edit row ", -1)])) : a("", !0),
				T(u).delete && S.value !== "delete" ? (y(), o("button", {
					key: 1,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "#ef4444" },
					onClick: F
				}, [...r[11] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z" })], -1), l(" Delete row ", -1)]])) : a("", !0)
			], 64)) : a("", !0)
		])], 4)]));
	}
}, [["__scopeId", "data-v-8e368a7d"]]), hr = ["data-st-theme"], gr = {
	key: 1,
	class: "flex items-center gap-2 px-3 py-2 text-[13px] shrink-0",
	style: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderBottom: "1px solid rgba(239,68,68,0.3)",
		color: "#ef4444"
	}
}, _r = { class: "flex-1" }, vr = { class: "flex flex-1 min-h-0 min-w-0" }, yr = { class: "flex flex-col flex-1 min-w-0 min-h-0" }, br = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif", xr = /* @__PURE__ */ Se({
	__name: "DataTable",
	props: {
		columns: {
			type: Array,
			required: !0
		},
		rows: {
			type: Array,
			required: !0
		},
		tableName: {
			type: String,
			default: "table"
		},
		loading: {
			type: Boolean,
			default: !1
		},
		error: {
			type: String,
			default: null
		},
		defaultColumnVisibility: {
			type: Object,
			default: () => ({})
		},
		showDataTypes: {
			type: Boolean,
			default: !0
		},
		editable: {
			type: [Boolean, Object],
			default: !0
		},
		selectionActions: {
			type: Array,
			default: () => []
		},
		enableSelectAll: {
			type: Boolean,
			default: !0
		},
		toolbarActions: {
			type: Array,
			default: () => []
		},
		toolbarActionsLabel: {
			type: String,
			default: "Actions"
		},
		defaultInsertLabel: {
			type: String,
			default: null
		},
		showRowBorders: {
			type: Boolean,
			default: !0
		},
		showColumnBorders: {
			type: Boolean,
			default: !0
		},
		cellButtonVisibility: {
			type: String,
			default: "hover",
			validator: (e) => [
				"hover",
				"always",
				"select"
			].includes(e)
		},
		theme: {
			type: String,
			default: "dark"
		},
		accentColor: {
			type: String,
			default: "#3ecf8e"
		},
		fontFamily: {
			type: String,
			default: null
		},
		getSubTable: {
			type: Function,
			default: null
		},
		subTableColumns: {
			type: Array,
			default: null
		},
		expandedRows: {
			type: Object,
			default: null
		},
		nestingDepth: {
			type: Number,
			default: 0
		},
		showToolbar: {
			type: Boolean,
			default: !0
		},
		showPagination: {
			type: Boolean,
			default: !0
		},
		emptyTitle: {
			type: String,
			default: "No rows found"
		},
		emptyMessage: {
			type: String,
			default: "Get started by inserting a new row."
		},
		totalCount: {
			type: Number,
			default: null
		},
		hasRandomAccess: {
			type: Boolean,
			default: !0
		},
		columnFilters: {
			type: Array,
			default: null
		},
		controlledSorting: {
			type: Array,
			default: null
		},
		controlledColumnFilters: {
			type: Array,
			default: null
		},
		controlledColumnVisibility: {
			type: Object,
			default: null
		},
		stagedEdits: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"insert-row",
		"update-row",
		"delete-rows",
		"insert-column",
		"update-column",
		"delete-column",
		"refresh",
		"selection-action",
		"toolbar-action",
		"view-change",
		"update:expanded-rows",
		"sub-table-event",
		"column-resize",
		"page-change",
		"update:column-filters",
		"commit-edits",
		"discard-edits"
	],
	setup(t, { emit: c }) {
		let l = Symbol("dataTable.fontFamily"), f = t;
		function p(e, t) {
			let n = parseInt(e.replace("#", ""), 16), r = Math.max(0, (n >> 16) - t), i = Math.max(0, (n >> 8 & 255) - t), a = Math.max(0, (n & 255) - t);
			return `#${(r << 16 | i << 8 | a).toString(16).padStart(6, "0")}`;
		}
		function v(e) {
			let t = parseInt(e.replace("#", ""), 16), n = (t >> 16) / 255, r = (t >> 8 & 255) / 255, i = (t & 255) / 255;
			return .2126 * n + .7152 * r + .0722 * i;
		}
		let S = r(() => {
			let e = f.theme === "dark", t = f.accentColor, n = p(t, 20), r = v(t) > .4 ? "#000" : "#fff", i = `color-mix(in srgb, ${t} 10%, transparent)`, a = `color-mix(in srgb, ${t} 40%, transparent)`, o = `color-mix(in srgb, ${t} 30%, transparent)`;
			return {
				"--st-bg": e ? "#1c1c1c" : "#ffffff",
				"--st-bg-header": e ? "#2a2a2a" : "#f4f4f5",
				"--st-bg-surface": e ? "#2a2a2a" : "#ffffff",
				"--st-bg-input": e ? "#2a2a2a" : "#f4f4f5",
				"--st-bg-row-hover": e ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
				"--st-bg-menu-hover": e ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
				"--st-bg-selected": e ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.08)",
				"--st-bg-selected-cell": e ? "rgba(59,130,246,0.25)" : "rgba(59,130,246,0.12)",
				"--st-bg-overlay": e ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.3)",
				"--st-bg-panel-overlay": e ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.15)",
				"--st-border": e ? "#333333" : "#e4e4e7",
				"--st-border-secondary": e ? "#444444" : "#d4d4d8",
				"--st-border-tertiary": e ? "#555555" : "#a1a1aa",
				"--st-text": e ? "#e5e5e5" : "#18181b",
				"--st-text-secondary": e ? "#a1a1aa" : "#52525b",
				"--st-text-tertiary": e ? "#71717a" : "#a1a1aa",
				"--st-text-placeholder": e ? "#52525b" : "#a1a1aa",
				"--st-text-on-accent": r,
				"--st-accent": t,
				"--st-accent-hover": n,
				"--st-accent-bg": i,
				"--st-accent-border": a,
				"--st-accent-border-light": o,
				"--st-toggle-off": e ? "#52525b" : "#d4d4d8",
				"--st-shadow-sticky": e ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.08)"
			};
		}), E = d(l, null), D = r(() => {
			if (f.fontFamily != null && String(f.fontFamily).trim() !== "") return String(f.fontFamily).trim();
			let e = E == null ? null : T(E);
			return e != null && String(e).trim() !== "" ? String(e).trim() : null;
		});
		b(l, D);
		let O = r(() => ({ "--dt-font-family": D.value || br })), j = r(() => ({
			...S.value,
			...O.value,
			backgroundColor: "var(--st-bg)",
			color: "var(--st-text)"
		})), M = x(null), N = c, z = r(() => f.editable === !0 ? {
			insert: !0,
			update: !0,
			delete: !0
		} : f.editable === !1 ? {
			insert: !1,
			update: !1,
			delete: !1
		} : {
			insert: !0,
			update: !0,
			delete: !0,
			...f.editable
		}), ee = x(!1);
		k(() => f.error, () => {
			ee.value = !1;
		});
		let B = C(f.rows);
		k(() => f.rows, (e) => {
			f.stagedEdits || (B.value = e);
		});
		let V = x(f.controlledSorting ?? []), H = x(f.controlledColumnFilters ?? f.columnFilters ?? []), U = x({}), W = x({
			pageIndex: 0,
			pageSize: 100
		}), G = x({}), K = x({
			startOffset: null,
			startSize: null,
			deltaOffset: null,
			deltaPercentage: null,
			isResizingColumn: !1,
			columnSizingStart: []
		}), q = x(f.controlledColumnVisibility ?? { ...f.defaultColumnVisibility });
		k(() => f.controlledSorting, (e) => {
			e !== null && (V.value = e);
		}, { deep: !0 }), k(() => f.controlledColumnFilters, (e) => {
			e !== null && (H.value = e);
		}, { deep: !0 }), k(() => f.columnFilters, (e) => {
			e !== null && (H.value = e);
		}, { deep: !0 }), k(() => f.controlledColumnVisibility, (e) => {
			e !== null && (q.value = e);
		}, { deep: !0 });
		let te = x([]), J = x([]), ne = x({}), re = x({}), Y = r(() => f.expandedRows ?? re.value);
		function ie(e) {
			f.expandedRows === null ? re.value = {
				...re.value,
				[e]: !re.value[e]
			} : N("update:expanded-rows", {
				...f.expandedRows,
				[e]: !f.expandedRows[e]
			});
		}
		function ae(e, t, n) {
			if (!n || typeof n != "object") return !0;
			let { operator: r, value: i } = n;
			if (!r || i === "" || i === void 0) return !0;
			let a = e.getValue(t), o = a == null ? "" : String(a), s = Number(a), c = Number(i), l = !isNaN(s) && !isNaN(c) && i !== "";
			switch (r) {
				case "=": return o === i;
				case "<>": return o !== i;
				case ">": return l ? s > c : o > i;
				case "<": return l ? s < c : o < i;
				case ">=": return l ? s >= c : o >= i;
				case "<=": return l ? s <= c : o <= i;
				case "~~": return o.includes(i);
				case "~~*": return o.toLowerCase().includes(i.toLowerCase());
				case "in": return i.split(",").map((e) => e.trim()).includes(o);
				case "is": {
					let e = i.toLowerCase();
					return e === "null" ? a == null : e === "not null" ? a != null : e === "true" ? a === !0 : e === "false" ? a === !1 : !0;
				}
				default: return o.toLowerCase().includes(i.toLowerCase());
			}
		}
		let oe = r(() => {
			for (let e of f.columns) if (e.meta?.isPrimaryKey) return e.accessorKey ?? e.id ?? "id";
			return "id";
		}), se = r(() => f.totalCount !== null), X = x(/* @__PURE__ */ new Map()), ce = x(!1), le = 0;
		function ue() {
			return le += 1, `${he}${Date.now()}_${le}`;
		}
		function de(e) {
			let t = oe.value;
			return f.rows.find((n) => String(n[t] ?? n.id) === String(e));
		}
		let fe = r(() => X.value.size > 0), pe = r(() => X.value.size), me = r(() => {
			if (!f.stagedEdits || X.value.size === 0) return f.rows;
			let e = oe.value, t = [], n = f.rows.map((t) => {
				let n = String(t[e] ?? t.id), r = X.value.get(n);
				return r && r.kind === Z.UPDATE ? {
					...t,
					...r.changes
				} : t;
			});
			for (let [e, n] of X.value) n.kind === Z.INSERT && t.push({
				...n.changes,
				__stagedId: e
			});
			return [...n, ...t];
		});
		function ge(e) {
			let t = ue(), n = new Map(X.value);
			n.set(t, {
				kind: Z.INSERT,
				changes: { ...e }
			}), X.value = n;
		}
		function _e(e, t) {
			let n = String(e), r = new Map(X.value), i = r.get(n);
			if (i?.kind === Z.INSERT) r.set(n, {
				kind: Z.INSERT,
				changes: {
					...i.changes,
					...t
				}
			});
			else if (i?.kind === Z.DELETE) {
				let e = i.snapshot ?? de(n);
				r.set(n, {
					kind: Z.UPDATE,
					changes: { ...t },
					snapshot: e
				});
			} else if (i?.kind === Z.UPDATE) {
				let e = {
					...i.changes,
					...t
				}, a = i.snapshot;
				Object.keys(e).some((t) => e[t] !== a?.[t]) ? r.set(n, {
					kind: Z.UPDATE,
					changes: e,
					snapshot: a
				}) : r.delete(n);
			} else {
				let e = de(n);
				Object.keys(t).some((n) => t[n] !== e?.[n]) && r.set(n, {
					kind: Z.UPDATE,
					changes: { ...t },
					snapshot: e
				});
			}
			X.value = r;
		}
		function ve(e) {
			let t = new Map(X.value);
			for (let n of e) {
				let e = String(n), r = t.get(e);
				if (r?.kind === Z.INSERT) t.delete(e);
				else {
					let n = r?.snapshot ?? de(e);
					t.set(e, {
						kind: Z.DELETE,
						snapshot: n
					});
				}
			}
			X.value = t;
		}
		function ye(e) {
			let t = new Map(X.value);
			t.delete(String(e)), X.value = t;
		}
		function be(e, t) {
			let n = String(e), r = X.value.get(n);
			if (!r || r.kind !== Z.UPDATE) return;
			let { [t]: i, ...a } = r.changes, o = new Map(X.value);
			Object.keys(a).length === 0 ? o.delete(n) : o.set(n, {
				...r,
				changes: a
			}), X.value = o;
		}
		function xe(e) {
			return X.value.get(String(e))?.kind ?? null;
		}
		function Se(e, t) {
			let n = X.value.get(String(e));
			return n && n.kind === Z.UPDATE && t in n.changes ? "modified" : null;
		}
		function Ce(e, t) {
			let n = X.value.get(String(e));
			if (!(!n || n.kind !== Z.UPDATE)) return n.snapshot?.[t];
		}
		function we() {
			let e = [], t = [], n = [];
			for (let [r, i] of X.value) i.kind === Z.INSERT ? e.push({ ...i.changes }) : i.kind === Z.UPDATE ? t.push({
				id: r,
				changes: { ...i.changes }
			}) : i.kind === Z.DELETE && n.push(r);
			return {
				inserts: e,
				updates: t,
				deletes: n
			};
		}
		function Te() {
			if (ce.value || !fe.value) return;
			let e = we();
			ce.value = !0, N("commit-edits", e, (e) => {
				ce.value = !1, e && (X.value = /* @__PURE__ */ new Map());
			});
		}
		function Ee() {
			X.value = /* @__PURE__ */ new Map(), N("discard-edits");
		}
		k(() => [f.stagedEdits, me.value], ([e, t]) => {
			e ? B.value = t : B.value = f.rows;
		}, { immediate: !0 });
		let Q = R({
			data: B,
			get columns() {
				return f.columns;
			},
			filterFns: { operator: ae },
			defaultColumn: { filterFn: "operator" },
			state: {
				get sorting() {
					return V.value;
				},
				get columnFilters() {
					return H.value;
				},
				get rowSelection() {
					return U.value;
				},
				get pagination() {
					return W.value;
				},
				get columnSizing() {
					return G.value;
				},
				get columnSizingInfo() {
					return K.value;
				},
				get columnVisibility() {
					return q.value;
				}
			},
			onSortingChange: (e) => {
				V.value = typeof e == "function" ? e(V.value) : e;
			},
			onColumnFiltersChange: (e) => {
				H.value = typeof e == "function" ? e(H.value) : e, N("update:column-filters", H.value);
			},
			onRowSelectionChange: (e) => {
				U.value = typeof e == "function" ? e(U.value) : e;
			},
			onPaginationChange: (e) => {
				let t = typeof e == "function" ? e(W.value) : e;
				W.value = t, se.value && N("page-change", {
					pageIndex: t.pageIndex,
					pageSize: t.pageSize
				});
			},
			onColumnSizingChange: (e) => {
				G.value = typeof e == "function" ? e(G.value) : e;
			},
			onColumnSizingInfoChange: (e) => {
				let t = K.value, n = typeof e == "function" ? e(t) : e;
				K.value = n, t.isResizingColumn && !n.isResizingColumn && N("column-resize", G.value);
			},
			onColumnVisibilityChange: (e) => {
				q.value = typeof e == "function" ? e(q.value) : e;
			},
			getCoreRowModel: P(),
			getSortedRowModel: L(),
			getFilteredRowModel: F(),
			getPaginationRowModel: I(),
			get manualPagination() {
				return se.value;
			},
			get pageCount() {
				if (se.value) return Math.ceil(f.totalCount / W.value.pageSize);
			},
			enableRowSelection: !0,
			enableMultiRowSelection: !0,
			enableColumnResizing: !0,
			columnResizeMode: "onChange",
			getRowId: (e) => e.__stagedId ? String(e.__stagedId) : String(e[oe.value] ?? e.id)
		}), De = r(() => Object.keys(U.value).length), Oe = r(() => De.value > 0), ke = x({
			open: !1,
			mode: "insert",
			rowData: null
		});
		function Ae() {
			ke.value = {
				open: !0,
				mode: "insert",
				rowData: null
			};
		}
		function je(e) {
			ke.value = {
				open: !0,
				mode: "update",
				rowData: { ...e }
			};
		}
		function Me() {
			ke.value = {
				open: !1,
				mode: "insert",
				rowData: null
			};
		}
		function Ne(e) {
			if (ke.value.mode === "insert") f.stagedEdits ? ge(e) : N("insert-row", e);
			else if (f.stagedEdits) {
				let t = oe.value, n = String(e[t] ?? e.id), r = de(n) ?? {}, i = {};
				for (let n of Object.keys(e)) n !== t && e[n] !== r[n] && (i[n] = e[n]);
				Object.keys(i).length > 0 && _e(n, i);
			} else N("update-row", {
				id: e.id,
				changes: e
			});
			Me();
		}
		function Pe(e) {
			f.stagedEdits ? ve(e) : N("delete-rows", e), Q.resetRowSelection();
		}
		function Fe(e, t, n) {
			f.stagedEdits ? _e(e, { [t]: n }) : N("update-row", {
				id: e,
				changes: { [t]: n }
			});
		}
		let $ = x({
			show: !1,
			x: 0,
			y: 0,
			row: null,
			cell: null
		});
		function Ie(e, t, n) {
			$.value = {
				show: !0,
				x: e.clientX,
				y: e.clientY,
				row: t,
				cell: n
			};
		}
		function Le() {
			$.value = {
				show: !1,
				x: 0,
				y: 0,
				row: null,
				cell: null
			};
		}
		function Re(e, t) {
			H.value.find((t) => t.id === e) ? H.value = H.value.map((n) => n.id === e ? {
				...n,
				value: {
					operator: "=",
					value: t
				}
			} : n) : H.value = [...H.value, {
				id: e,
				value: {
					operator: "=",
					value: t
				}
			}];
		}
		b("themeVars", r(() => ({
			...S.value,
			...O.value
		}))), b("table", Q), b("tableName", f.tableName), b("showDataTypes", f.showDataTypes), b("editable", z), b("showRowBorders", f.showRowBorders), b("showColumnBorders", f.showColumnBorders), b("cellButtonVisibility", r(() => f.cellButtonVisibility)), b("insertRow", () => N("insert-row")), b("openInsertPanel", Ae), b("emptyTitle", r(() => f.emptyTitle)), b("emptyMessage", r(() => f.emptyMessage)), b("defaultInsertLabel", r(() => f.defaultInsertLabel)), b("expanded", Y), b("toggleRowExpanded", ie), b("getSubTable", f.getSubTable), b("nestingDepth", f.nestingDepth), b("parentTheme", r(() => f.theme)), b("parentAccentColor", r(() => f.accentColor)), b("subTableSorting", te), b("subTableColumnFilters", J), b("subTableColumnVisibility", ne), b("stagedEditsEnabled", r(() => f.stagedEdits)), b("getRowPendingState", xe), b("getCellPendingState", Se), b("getCellPreviousValue", Ce), b("undoRowEdit", ye), b("undoCellEdit", be), k(() => f.rows, () => {
			Q.resetRowSelection();
		});
		function ze() {
			if (typeof document > "u") return;
			let e = document.createElement("canvas").getContext("2d");
			if (!e) return;
			let t = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
			if (M.value) {
				let e = getComputedStyle(M.value).fontFamily;
				e && e.trim() !== "" && (t = e);
			}
			e.font = `13px ${t}`;
			let n = {}, r = Q.getAllLeafColumns(), i = B.value.slice(0, 200);
			for (let t of r) {
				let r = t.columnDef.meta || {}, a = typeof t.columnDef.header == "string" ? t.columnDef.header : String(t.id), o = e.measureText(a).width;
				if (f.showDataTypes && r.type && (o += 6 + e.measureText(r.type).width), !(r.type === "boolean" || r.progressBar)) {
					let n = t.columnDef.accessorKey ?? t.id;
					for (let t of i) {
						let r = t?.[n];
						if (r == null) continue;
						let i = e.measureText(String(r)).width;
						i > o && (o = i);
					}
				}
				Array.isArray(r.cellButtons) && r.cellButtons.length > 0 && (o += r.cellButtons.length * 22);
				let s = Math.ceil(o) + 16 + 28;
				n[t.id] = Math.min(Math.max(s, 60), 500);
			}
			G.value = {
				...n,
				...G.value
			};
		}
		return _(() => {
			m(ze);
		}), (r, c) => (y(), o("div", {
			ref_key: "rootElRef",
			ref: M,
			class: h(["data-table-root flex flex-col text-[13px]", t.nestingDepth === 0 ? "flex-1 min-h-0 min-w-0" : ""]),
			"data-st-theme": t.theme,
			style: g(j.value)
		}, [
			t.showToolbar ? (y(), o(e, { key: 0 }, [Oe.value ? (y(), i(At, {
				key: 0,
				"selected-count": De.value,
				table: T(Q),
				editable: z.value,
				"selection-actions": t.selectionActions,
				"enable-select-all": t.enableSelectAll,
				onDeleteRows: Pe,
				onSelectionAction: c[0] ||= (e, t) => N("selection-action", e, t)
			}, null, 8, [
				"selected-count",
				"table",
				"editable",
				"selection-actions",
				"enable-select-all"
			])) : (y(), i(xt, {
				key: 1,
				table: T(Q),
				sorting: V.value,
				"column-filters": H.value,
				"column-visibility": q.value,
				"default-column-visibility": t.defaultColumnVisibility,
				editable: z.value,
				loading: t.loading,
				"is-empty": B.value.length === 0,
				"default-insert-label": t.defaultInsertLabel,
				"toolbar-actions": t.toolbarActions,
				"toolbar-actions-label": t.toolbarActionsLabel,
				"sub-table-columns": t.subTableColumns,
				"sub-table-sorting": te.value,
				"sub-table-column-filters": J.value,
				"sub-table-column-visibility": ne.value,
				"table-name": t.tableName,
				"onUpdate:sorting": c[1] ||= (e) => V.value = e,
				"onUpdate:columnFilters": c[2] ||= (e) => H.value = e,
				"onUpdate:columnVisibility": c[3] ||= (e) => q.value = e,
				"onUpdate:subTableSorting": c[4] ||= (e) => te.value = e,
				"onUpdate:subTableColumnFilters": c[5] ||= (e) => J.value = e,
				"onUpdate:subTableColumnVisibility": c[6] ||= (e) => ne.value = e,
				onInsertRow: Ae,
				onRefresh: c[7] ||= (e) => N("refresh"),
				onToolbarAction: c[8] ||= (e) => N("toolbar-action", e)
			}, null, 8, [
				"table",
				"sorting",
				"column-filters",
				"column-visibility",
				"default-column-visibility",
				"editable",
				"loading",
				"is-empty",
				"default-insert-label",
				"toolbar-actions",
				"toolbar-actions-label",
				"sub-table-columns",
				"sub-table-sorting",
				"sub-table-column-filters",
				"sub-table-column-visibility",
				"table-name"
			]))], 64)) : a("", !0),
			t.error && !ee.value ? (y(), o("div", gr, [
				c[15] ||= s("svg", {
					class: "w-3.5 h-3.5 shrink-0",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" })], -1),
				s("span", _r, w(t.error), 1),
				s("button", {
					class: "opacity-60 hover:opacity-100",
					onClick: c[9] ||= (e) => ee.value = !0
				}, [...c[14] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])
			])) : a("", !0),
			s("div", vr, [s("div", yr, [u(vn, {
				table: T(Q),
				onUpdateCell: Fe,
				onContextMenu: Ie,
				onEditRow: je
			}, null, 8, ["table"]), t.showPagination ? (y(), i(Fn, {
				key: 0,
				table: T(Q),
				"total-count": t.totalCount,
				"has-random-access": t.hasRandomAccess,
				"staged-edits": t.stagedEdits,
				"pending-edit-count": pe.value,
				committing: ce.value || t.loading,
				onCommit: Te,
				onDiscard: Ee
			}, null, 8, [
				"table",
				"total-count",
				"has-random-access",
				"staged-edits",
				"pending-edit-count",
				"committing"
			])) : a("", !0)]), u(n, { name: "slide-panel" }, {
				default: A(() => [(z.value.insert || z.value.update) && ke.value.open ? (y(), i(cr, {
					key: 0,
					mode: ke.value.mode,
					"row-data": ke.value.rowData,
					table: T(Q),
					"table-name": t.tableName,
					onSave: Ne,
					onClose: Me
				}, null, 8, [
					"mode",
					"row-data",
					"table",
					"table-name"
				])) : a("", !0)]),
				_: 1
			})]),
			$.value.show ? (y(), i(mr, {
				key: 2,
				x: $.value.x,
				y: $.value.y,
				row: $.value.row,
				cell: $.value.cell,
				onClose: Le,
				onEditRow: c[10] ||= (e) => je($.value.row.original),
				onDeleteRow: c[11] ||= (e) => Pe([$.value.row.id]),
				onFilterByValue: Re,
				onUndoRow: c[12] ||= (e) => ye($.value.row.id),
				onUndoCell: c[13] ||= (e) => be($.value.row.id, e)
			}, null, 8, [
				"x",
				"y",
				"row",
				"cell"
			])) : a("", !0)
		], 14, hr));
	}
}, [["__scopeId", "data-v-a8b3cfd1"]]);
//#endregion
export { xr as DataTable };
