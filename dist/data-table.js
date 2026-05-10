import { Fragment as e, Teleport as t, Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createStaticVNode as c, createTextVNode as l, createVNode as u, inject as d, isRef as f, mergeProps as p, nextTick as m, normalizeClass as h, normalizeStyle as g, onMounted as _, onUnmounted as v, openBlock as y, provide as b, ref as x, renderList as S, toDisplayString as C, toValue as w, unref as T, useTemplateRef as E, vModelSelect as D, vModelText as O, watch as k, watchEffect as A, withCtx as j, withDirectives as ee, withModifiers as M } from "vue";
import { FlexRender as N, getCoreRowModel as P, getFilteredRowModel as F, getPaginationRowModel as I, getSortedRowModel as L, useVueTable as R } from "@tanstack/vue-table";
import { onClickOutside as z } from "@vueuse/core";
import { useVirtualizer as B } from "@tanstack/vue-virtual";
//#region \0plugin-vue:export-helper
var V = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, H = { class: "p-3" }, te = {
	key: 0,
	class: "text-center py-4",
	style: { color: "var(--st-text-tertiary)" }
}, ne = {
	key: 1,
	class: "text-xs font-medium uppercase tracking-wide mb-2",
	style: { color: "var(--st-text-placeholder)" }
}, U = ["onDragstart", "onDragover"], W = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, G = ["onUpdate:modelValue"], K = ["value"], re = ["onClick", "title"], q = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, ie = {
	key: 0,
	"fill-rule": "evenodd",
	d: "M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
}, J = {
	key: 1,
	"fill-rule": "evenodd",
	d: "M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
}, ae = ["onClick"], oe = ["onDragstart", "onDragover"], se = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, ce = ["onUpdate:modelValue"], le = ["value"], ue = ["onClick", "title"], de = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, fe = {
	key: 0,
	"fill-rule": "evenodd",
	d: "M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
}, Y = {
	key: 1,
	"fill-rule": "evenodd",
	d: "M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
}, pe = ["onClick"], me = {
	class: "px-3 py-2 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, he = /* @__PURE__ */ V({
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
		function w() {
			let e = h.value.filter((e) => e.table === "parent").map(({ table: e, ...t }) => t), t = h.value.filter((e) => e.table === "sub").map(({ table: e, ...t }) => t);
			u("update:sorting", e), p.value && u("update:sub-table-sorting", t), u("close");
		}
		function E() {
			h.value = [], u("update:sorting", []), p.value && u("update:sub-table-sorting", []), u("close");
		}
		let O = r(() => h.value.filter((e) => e.table === "parent")), A = r(() => h.value.filter((e) => e.table === "sub"));
		function j(e, t) {
			let n = 0;
			for (let r = 0; r < h.value.length; r++) if (h.value[r].table === e) {
				if (n === t) return r;
				n++;
			}
			return -1;
		}
		let N = x(null), P = x(null);
		function F(e) {
			N.value = e;
		}
		function I(e, t) {
			e.preventDefault(), P.value = t;
		}
		function L() {
			if (N.value !== null && P.value !== null && N.value !== P.value) {
				let e = [...h.value], [t] = e.splice(N.value, 1);
				e.splice(P.value, 0, t), h.value = e;
			}
			N.value = null, P.value = null;
		}
		return (n, r) => (y(), o("div", {
			class: "absolute top-full right-0 mt-1 w-96 rounded shadow-xl z-50 text-[13px]",
			style: {
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			},
			onClick: r[2] ||= M(() => {}, ["stop"])
		}, [s("div", H, [
			h.value.length === 0 ? (y(), o("div", te, [...r[3] ||= [s("p", { class: "mb-1" }, "No sorts applied to this view", -1), s("p", { class: "text-xs" }, "Add a column below to sort the view", -1)]])) : a("", !0),
			p.value ? (y(), o("div", ne, C(t.tableName), 1)) : a("", !0),
			(y(!0), o(e, null, S(O.value, (n, i) => (y(), o("div", {
				key: "p-" + i,
				class: "flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors",
				style: g(P.value === j("parent", i) && N.value !== j("parent", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
				draggable: "true",
				onDragstart: (e) => F(j("parent", i)),
				onDragover: (e) => I(e, j("parent", i)),
				onDragend: L
			}, [
				r[5] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\" data-v-f1143526><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\" data-v-f1143526><circle cx=\"5.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle></svg></span>", 1),
				s("span", W, C(i === 0 ? "sort by" : "then by"), 1),
				ee(s("select", {
					"onUpdate:modelValue": (e) => n.id = e,
					class: "sort-select flex-1 rounded py-1 text-[13px] outline-none min-w-0",
					style: {
						backgroundColor: "var(--st-bg)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					}
				}, [(y(!0), o(e, null, S(t.allColumns, (t) => (y(), o("option", {
					key: t.id,
					value: t.id
				}, [l(C(t.id), 1), T(f) ? (y(), o(e, { key: 0 }, [l(" (" + C(t.type) + ")", 1)], 64)) : a("", !0)], 8, K))), 128))], 8, G), [[D, n.id]]),
				s("button", {
					class: "shrink-0 w-[68px] flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
					style: g(n.desc ? {
						color: "#3b82f6",
						backgroundColor: "rgba(59, 130, 246, 0.1)",
						border: "1px solid rgba(59, 130, 246, 0.3)"
					} : {
						color: "var(--st-accent)",
						backgroundColor: "var(--st-accent-bg)",
						border: "1px solid var(--st-accent-border-light)"
					}),
					onClick: (e) => b(j("parent", i)),
					title: n.desc ? "Descending — click to toggle" : "Ascending — click to toggle"
				}, [(y(), o("svg", q, [n.desc ? (y(), o("path", J)) : (y(), o("path", ie))])), l(" " + C(n.desc ? "DESC" : "ASC"), 1)], 12, re),
				s("button", {
					class: "shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors",
					style: { color: "var(--st-text-tertiary)" },
					title: "Remove sort rule",
					onClick: (e) => v(j("parent", i))
				}, [...r[4] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, ae)
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
					style: g(P.value === j("sub", i) && N.value !== j("sub", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					draggable: "true",
					onDragstart: (e) => F(j("sub", i)),
					onDragover: (e) => I(e, j("sub", i)),
					onDragend: L
				}, [
					r[7] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\" data-v-f1143526><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\" data-v-f1143526><circle cx=\"5.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle></svg></span>", 1),
					s("span", se, C(i === 0 ? "sort by" : "then by"), 1),
					ee(s("select", {
						"onUpdate:modelValue": (e) => n.id = e,
						class: "sort-select flex-1 rounded py-1 text-[13px] outline-none min-w-0",
						style: {
							backgroundColor: "var(--st-bg)",
							border: "1px solid var(--st-border-secondary)",
							color: "var(--st-text)"
						}
					}, [(y(!0), o(e, null, S(t.subTableColumns, (t) => (y(), o("option", {
						key: t.id,
						value: t.id
					}, [l(C(t.id), 1), T(f) ? (y(), o(e, { key: 0 }, [l(" (" + C(t.type) + ")", 1)], 64)) : a("", !0)], 8, le))), 128))], 8, ce), [[D, n.id]]),
					s("button", {
						class: "shrink-0 w-[68px] flex items-center justify-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors",
						style: g(n.desc ? {
							color: "#3b82f6",
							backgroundColor: "rgba(59, 130, 246, 0.1)",
							border: "1px solid rgba(59, 130, 246, 0.3)"
						} : {
							color: "var(--st-accent)",
							backgroundColor: "var(--st-accent-bg)",
							border: "1px solid var(--st-accent-border-light)"
						}),
						onClick: (e) => b(j("sub", i)),
						title: n.desc ? "Descending — click to toggle" : "Ascending — click to toggle"
					}, [(y(), o("svg", de, [n.desc ? (y(), o("path", Y)) : (y(), o("path", fe))])), l(" " + C(n.desc ? "DESC" : "ASC"), 1)], 12, ue),
					s("button", {
						class: "shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors",
						style: { color: "var(--st-text-tertiary)" },
						title: "Remove sort rule",
						onClick: (e) => v(j("sub", i))
					}, [...r[6] ||= [s("svg", {
						class: "w-3.5 h-3.5",
						viewBox: "0 0 16 16",
						fill: "currentColor"
					}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, pe)
				], 44, oe))), 128)),
				s("button", {
					class: "text-[13px] mt-1",
					style: { color: "var(--st-text-secondary)" },
					onClick: r[1] ||= (e) => _("sub")
				}, " + Pick a column to sort by ")
			], 64)) : a("", !0)
		]), s("div", me, [h.value.length > 0 ? (y(), o("button", {
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
			onClick: w
		}, " Apply sorting ")])]));
	}
}, [["__scopeId", "data-v-f1143526"]]), ge = [
	"date",
	"time",
	"timetz",
	"timestamp",
	"timestamptz",
	"datetime"
], _e = [
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
			label: "Contains",
			value: "~~"
		}, {
			label: "Excludes",
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
], X = {
	INSERT: "insert",
	UPDATE: "update",
	DELETE: "delete"
}, ve = "__pending_", Z = { class: "relative flex items-center" }, ye = {
	key: 0,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, be = {
	key: 1,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, xe = {
	class: "rounded-lg shadow-xl p-3",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Se = ["type", "value"], Ce = {
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
		return (e, n) => (y(), o("div", Z, [s("button", {
			ref_key: "triggerRef",
			ref: h,
			class: "flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0",
			style: g({ color: p.value ? "var(--st-accent)" : "var(--st-text-placeholder)" }),
			title: "Pick date/time",
			onClick: M(C, ["stop"])
		}, [_.value === "time" ? (y(), o("svg", ye, [...n[1] ||= [s("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25a.75.75 0 00-1.5 0v3.5c0 .27.144.518.378.651l2.5 1.5a.75.75 0 10.744-1.302L8.5 7.742V4.75z" }, null, -1)]])) : (y(), o("svg", be, [...n[2] ||= [s("path", { d: "M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h10.5V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5H2.5z" }, null, -1)]]))], 4), (y(), i(t, { to: "body" }, [p.value ? (y(), o("div", {
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
		}, [s("div", xe, [s("input", {
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
		}, null, 44, Se)])], 4)) : a("", !0)]))]));
	}
}, we = { class: "flex items-center gap-1.5 flex-wrap flex-1 min-w-0" }, Te = {
	key: 0,
	class: "text-[10px] font-medium uppercase px-1 rounded",
	style: {
		color: "var(--st-text-placeholder)",
		backgroundColor: "var(--st-bg-input)"
	}
}, Ee = { style: { color: "var(--st-text-secondary)" } }, De = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Oe = ["value", "onInput"], ke = ["onClick"], Ae = {
	key: 0,
	class: "text-[10px] font-medium uppercase px-1 rounded",
	style: {
		color: "var(--st-text-placeholder)",
		backgroundColor: "var(--st-bg-input)"
	}
}, je = { style: { color: "var(--st-text-secondary)" } }, Me = ["placeholder"], Ne = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], Pe = { style: { color: "var(--st-text)" } }, Fe = {
	key: 0,
	class: "text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Ie = {
	key: 0,
	class: "px-3 py-2 text-[13px]",
	style: { color: "var(--st-text-placeholder)" }
}, Q = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, Le = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], Re = { style: { color: "var(--st-text)" } }, ze = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Be = /* @__PURE__ */ V({
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
		let l = n, u = c, f = d("showDataTypes", !0), p = d("themeVars", {}), h = r(() => {
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
		}), _ = r(() => h.value.some((e) => e.table === "sub")), v = x("closed"), b = x(null), w = x(""), E = x(0), D = x(null), j = x(null), M = x(null), N = x({
			top: 0,
			left: 0
		}), P = x({});
		function F() {
			if (v.value === "operators" && M.value) {
				let e = M.value.getBoundingClientRect();
				N.value = {
					top: e.bottom + 4,
					left: e.right
				};
				return;
			}
			let e = j.value;
			if (!e) return;
			let t = e.getBoundingClientRect();
			N.value = {
				top: t.bottom + 4,
				left: t.left
			};
		}
		let I = r(() => {
			let e = [];
			for (let t of _e) {
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
		}), L = r(() => I.value.filter((e) => e.type === "operator")), R = r(() => {
			let e = w.value.toLowerCase();
			return e ? l.allColumns.filter((t) => t.id.toLowerCase().includes(e)) : l.allColumns;
		}), z = r(() => R.value.map((e) => ({
			...e,
			table: "parent"
		}))), B = r(() => `Filter by ${l.allColumns.map((e) => e.id).slice(0, 3).join(", ")}...`), V = r(() => {
			let e = l.subTableColumns || [];
			return [...l.allColumns, ...e];
		});
		function H(e) {
			return V.value.find((t) => t.id === e)?.type || "varchar";
		}
		function te(e) {
			return ge.includes(H(e));
		}
		function ne(e) {
			return e.value?.operator || "=";
		}
		function U(e) {
			return e.value?.value ?? "";
		}
		function W() {
			v.value = "columns", E.value = 0;
		}
		function G(e, t) {
			b.value = {
				id: e,
				table: t
			}, w.value = "", v.value = "operators", E.value = 0;
		}
		function K(e) {
			if (!b.value) return;
			let { id: t, table: n } = b.value, r = {
				id: t,
				value: {
					operator: e,
					value: ""
				}
			};
			n === "sub" ? u("update:sub-table-column-filters", [...l.subTableColumnFilters, r]) : u("update:column-filters", [...l.columnFilters, r]), v.value = "closed", b.value = null, w.value = "", D.value?.blur();
			let i = () => {
				let e = h.value.length - 1, t = P.value[e];
				t ? t.focus() : m(i);
			};
			m(() => m(i));
		}
		function re(e) {
			let t = h.value[e];
			t.table === "sub" ? u("update:sub-table-column-filters", l.subTableColumnFilters.filter((e, n) => n !== t.sourceIndex)) : u("update:column-filters", l.columnFilters.filter((e, n) => n !== t.sourceIndex));
		}
		function q(e, t) {
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
		function ie(e) {
			v.value === "columns" ? J(e) : v.value === "operators" ? ae(e) : e.key !== "Escape" && W(), e.key === "Escape" && (se(), D.value?.blur());
		}
		function J(e) {
			let t = z.value;
			if (t.length !== 0) {
				if (e.key === "ArrowDown") e.preventDefault(), E.value = Math.min(E.value + 1, t.length - 1), oe("column-picker");
				else if (e.key === "ArrowUp") e.preventDefault(), E.value = Math.max(E.value - 1, 0), oe("column-picker");
				else if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					let n = t[E.value];
					n && G(n.id, n.table);
				}
			}
		}
		function ae(e) {
			let t = L.value;
			t.length !== 0 && (e.key === "ArrowDown" ? (e.preventDefault(), E.value = Math.min(E.value + 1, t.length - 1), oe("operator-picker")) : e.key === "ArrowUp" ? (e.preventDefault(), E.value = Math.max(E.value - 1, 0), oe("operator-picker")) : (e.key === "Enter" || e.key === "Tab") && (e.preventDefault(), t[E.value] && K(t[E.value].value)));
		}
		function oe(e) {
			m(() => {
				let t = document.getElementById(e)?.querySelector("[data-highlighted=\"true\"]");
				t && t.scrollIntoView({ block: "nearest" });
			});
		}
		function se() {
			v.value = "closed", b.value = null, w.value = "", E.value = 0;
		}
		function ce() {
			v.value === "closed" && W();
		}
		return k(w, () => {
			E.value = 0;
		}), A((e) => {
			if (v.value === "closed") return;
			function t() {
				m(F);
			}
			F(), window.addEventListener("resize", t), window.addEventListener("scroll", t, !0), e(() => {
				window.removeEventListener("resize", t), window.removeEventListener("scroll", t, !0);
			});
		}), (r, c) => (y(), o("div", we, [
			(y(!0), o(e, null, S(h.value, (e, t) => (y(), o("div", {
				key: e.table + "-" + e.sourceIndex,
				class: "flex items-center gap-1 rounded px-2 py-0.5 text-[13px]",
				style: {
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)"
				}
			}, [
				_.value ? (y(), o("span", Te, C(e.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0),
				s("span", Ee, C(e.id), 1),
				s("span", De, C(ne(e)), 1),
				s("input", {
					ref_for: !0,
					ref: (e) => {
						e && (P.value[t] = e);
					},
					value: U(e),
					class: "bg-transparent outline-none text-[13px]",
					style: g({
						color: "var(--st-text)",
						width: Math.max(6, (U(e) || "").length + 1) + "ch"
					}),
					placeholder: "value",
					onInput: (e) => q(t, e.target.value)
				}, null, 44, Oe),
				te(e.id) ? (y(), i(Ce, {
					key: 1,
					value: U(e),
					"column-type": H(e.id),
					onUpdate: (e) => q(t, e)
				}, null, 8, [
					"value",
					"column-type",
					"onUpdate"
				])) : a("", !0),
				s("button", {
					class: "ml-0.5 w-5 h-5 flex items-center justify-center rounded transition-colors filter-chip-close shrink-0",
					style: { color: "var(--st-text-placeholder)" },
					onClick: (e) => re(t)
				}, [...c[1] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]], 8, ke)
			]))), 128)),
			b.value ? (y(), o("div", {
				key: 0,
				ref_key: "pendingChipRef",
				ref: M,
				class: "flex items-center gap-1 rounded px-2 py-0.5 text-[13px]",
				style: {
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-accent-border)"
				}
			}, [_.value || b.value && b.value.table === "sub" ? (y(), o("span", Ae, C(b.value.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0), s("span", je, C(b.value.id), 1)], 512)) : a("", !0),
			s("div", {
				ref_key: "anchorRef",
				ref: j,
				class: "relative flex-1 min-w-[200px]"
			}, [
				ee(s("input", {
					ref_key: "searchInputRef",
					ref: D,
					"onUpdate:modelValue": c[0] ||= (e) => w.value = e,
					class: "w-full bg-transparent outline-none text-[13px] py-1",
					style: g({
						color: "var(--st-text)",
						caretColor: v.value === "operators" ? "transparent" : void 0
					}),
					placeholder: v.value === "operators" ? "Pick a filter method..." : h.value.length > 0 ? "+ Add more filters..." : B.value,
					onFocus: ce,
					onKeydown: ie
				}, null, 44, Me), [[O, w.value]]),
				(y(), i(t, { to: "body" }, [v.value === "columns" ? (y(), o("div", {
					key: 0,
					id: "column-picker",
					class: "fixed w-60 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
					style: g({
						...T(p),
						top: N.value.top + "px",
						left: N.value.left + "px",
						fontFamily: "var(--dt-font-family)",
						backgroundColor: "var(--st-bg-surface)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					})
				}, [(y(!0), o(e, null, S(R.value, (e, t) => (y(), o("div", {
					key: "p-" + e.id,
					class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
					"data-highlighted": t === E.value,
					style: g(t === E.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					onClick: (t) => G(e.id, "parent"),
					onMouseenter: (e) => E.value = t
				}, [s("span", Pe, C(e.id), 1), T(f) ? (y(), o("span", Fe, C(e.type), 1)) : a("", !0)], 44, Ne))), 128)), R.value.length === 0 ? (y(), o("div", Ie, " No columns found ")) : a("", !0)], 4)) : a("", !0)])),
				(y(), i(t, { to: "body" }, [v.value === "operators" ? (y(), o("div", {
					key: 0,
					id: "operator-picker",
					class: "fixed w-52 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
					style: g({
						...T(p),
						top: N.value.top + "px",
						left: N.value.left + "px",
						fontFamily: "var(--dt-font-family)",
						backgroundColor: "var(--st-bg-surface)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					})
				}, [(y(!0), o(e, null, S(I.value, (t, n) => (y(), o(e, { key: n }, [t.type === "header" ? (y(), o("div", Q, C(t.label), 1)) : (y(), o("div", {
					key: 1,
					class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
					"data-highlighted": L.value.indexOf(t) === E.value,
					style: g(L.value.indexOf(t) === E.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					onClick: (e) => K(t.value),
					onMouseenter: (e) => E.value = L.value.indexOf(t)
				}, [s("span", Re, C(t.label), 1), s("span", ze, C(t.value), 1)], 44, Le))], 64))), 128))], 4)) : a("", !0)])),
				(y(), i(t, { to: "body" }, [v.value === "closed" ? a("", !0) : (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: se
				}))]))
			], 512)
		]));
	}
}, [["__scopeId", "data-v-d6671bc9"]]), Ve = {
	class: "px-3 py-2 flex items-center justify-between",
	style: { borderBottom: "1px solid var(--st-border-secondary)" }
}, He = {
	class: "font-medium",
	style: { color: "var(--st-text-secondary)" }
}, Ue = { class: "max-h-72 overflow-auto py-1" }, We = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, Ge = ["onClick"], Ke = {
	key: 0,
	class: "w-3 h-3",
	style: { color: "var(--st-text-on-accent)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, qe = {
	key: 0,
	class: "text-xs ml-auto shrink-0",
	style: { color: "var(--st-text-placeholder)" }
}, Je = ["onClick"], Ye = {
	key: 0,
	class: "w-3 h-3",
	style: { color: "var(--st-text-on-accent)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, Xe = {
	key: 0,
	class: "text-xs ml-auto shrink-0",
	style: { color: "var(--st-text-placeholder)" }
}, Ze = /* @__PURE__ */ V({
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
		function w() {
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
		}, [s("div", Ve, [s("span", He, C(_.value) + " of " + C(v.value) + " columns", 1), s("div", { class: "flex items-center gap-2" }, [
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: w
			}, "Show all"),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: E
			}, "Default")
		])]), s("div", Ue, [
			u.value ? (y(), o("div", We, C(t.tableName), 1)) : a("", !0),
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
				}, [e.isVisible ? (y(), o("svg", Ke, [...r[2] ||= [s("path", { d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" }, null, -1)]])) : a("", !0)], 4),
				s("span", {
					class: "truncate",
					style: g({ color: e.isVisible ? "var(--st-text)" : "var(--st-text-tertiary)" })
				}, C(e.id), 5),
				T(l) ? (y(), o("span", qe, C(e.type), 1)) : a("", !0)
			], 8, Ge))), 128)),
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
					}, [e.isVisible ? (y(), o("svg", Ye, [...r[3] ||= [s("path", { d: "M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" }, null, -1)]])) : a("", !0)], 4),
					s("span", {
						class: "truncate",
						style: g({ color: e.isVisible ? "var(--st-text)" : "var(--st-text-tertiary)" })
					}, C(e.id), 5),
					T(l) ? (y(), o("span", Xe, C(e.type), 1)) : a("", !0)
				], 8, Je))), 128))
			], 64)) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-c662bbfe"]]), $ = { style: {
	borderBottom: "1px solid var(--st-border)",
	backgroundColor: "var(--st-bg)"
} }, Qe = { class: "flex items-center gap-2 px-3 py-1.5" }, $e = ["disabled"], et = ["disabled"], tt = ["disabled"], nt = {
	key: 0,
	class: "absolute top-full left-0 mt-1 min-w-[12rem] rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, rt = {
	key: 0,
	class: "my-1",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, it = ["disabled", "onClick"], at = ["innerHTML"], ot = { class: "flex-1" }, st = ["disabled"], ct = {
	key: 3,
	class: "absolute top-full right-0 mt-1 flex min-w-[11rem] w-max flex-col items-stretch rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, lt = ["onClick"], ut = ["innerHTML"], dt = { class: "shrink-0 whitespace-nowrap" }, ft = /* @__PURE__ */ V({
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
		insertActions: {
			type: Array,
			default: () => []
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
		"insert-action",
		"refresh",
		"toolbar-action"
	],
	setup(t, { emit: n }) {
		let c = t, d = n, f = x(!1), p = x(!1), m = x(!1), _ = x(!1), v = x(null), b = x(null), w = x(null), T = x(null);
		z(v, () => {
			f.value = !1;
		}), z(b, () => {
			_.value = !1;
		}), z(w, () => {
			m.value = !1;
		}), z(T, () => {
			p.value = !1;
		});
		function E(e) {
			e.disabled || (d("toolbar-action", e.key), _.value = !1);
		}
		let D = r(() => c.sorting.length + c.subTableSorting.length);
		r(() => c.columnFilters.length + c.subTableColumnFilters.length);
		let O = r(() => Object.values(c.columnVisibility).filter((e) => e === !1).length + Object.values(c.subTableColumnVisibility).filter((e) => e === !1).length), k = r(() => {
			let e = c.columnVisibility, t = c.defaultColumnVisibility, n = c.table.getAllColumns().map((e) => e.id);
			for (let r of n) if (e[r] !== !1 != (t[r] !== !1)) return !1;
			for (let e of Object.values(c.subTableColumnVisibility)) if (e === !1) return !1;
			return !0;
		}), A = r(() => c.table.getAllColumns().map((e) => ({
			id: e.id,
			type: e.columnDef.meta?.type || "text"
		}))), j = r(() => c.subTableColumns ? c.subTableColumns.map((e) => ({
			id: e.accessorKey || e.id || e.header,
			type: e.meta?.type || e.columnDef?.meta?.type || "text"
		})) : null);
		return (n, r) => (y(), o("div", $, [s("div", Qe, [
			u(Be, {
				table: t.table,
				"column-filters": t.columnFilters,
				"all-columns": A.value,
				"sub-table-columns": j.value,
				"sub-table-column-filters": t.subTableColumnFilters,
				"table-name": t.tableName,
				"onUpdate:columnFilters": r[0] ||= (e) => d("update:column-filters", e),
				"onUpdate:subTableColumnFilters": r[1] ||= (e) => d("update:sub-table-column-filters", e),
				class: "flex-1",
				style: g(t.isEmpty ? {
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
				disabled: t.loading,
				title: "Refresh",
				onClick: r[2] ||= (e) => d("refresh")
			}, [(y(), o("svg", {
				class: h(["w-4 h-4", t.loading ? "animate-spin" : ""]),
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [...r[18] ||= [s("path", { d: "M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" }, null, -1), s("path", { d: "M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z" }, null, -1)]], 2))], 8, $e),
			s("div", {
				ref_key: "sortContainerRef",
				ref: v,
				class: "relative"
			}, [s("button", {
				class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: g(t.isEmpty ? {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)",
					opacity: .4,
					cursor: "default"
				} : D.value > 0 ? {
					border: "1px solid var(--st-accent-border)",
					color: "var(--st-accent)",
					backgroundColor: "var(--st-accent-bg)"
				} : {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				}),
				disabled: t.isEmpty,
				onClick: r[3] ||= (e) => !t.isEmpty && (f.value = !f.value)
			}, [r[19] ||= s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M3.5 2.5a.5.5 0 00-1 0v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L3.5 12.293V2.5zm4 .5a.5.5 0 010-1h1a.5.5 0 010 1h-1zm0 3a.5.5 0 010-1h3a.5.5 0 010 1h-3zm0 3a.5.5 0 010-1h5a.5.5 0 010 1h-5zm0 3a.5.5 0 010-1h7a.5.5 0 010 1h-7z" })], -1), D.value > 0 ? (y(), o(e, { key: 0 }, [l(" Sorted by " + C(D.value) + " rule" + C(D.value > 1 ? "s" : ""), 1)], 64)) : (y(), o(e, { key: 1 }, [l("Sort")], 64))], 12, et), f.value ? (y(), i(he, {
				key: 0,
				table: t.table,
				sorting: t.sorting,
				"all-columns": A.value,
				"sub-table-columns": j.value,
				"sub-table-sorting": t.subTableSorting,
				"table-name": t.tableName,
				"onUpdate:sorting": r[4] ||= (e) => d("update:sorting", e),
				"onUpdate:subTableSorting": r[5] ||= (e) => d("update:sub-table-sorting", e),
				onClose: r[6] ||= (e) => f.value = !1
			}, null, 8, [
				"table",
				"sorting",
				"all-columns",
				"sub-table-columns",
				"sub-table-sorting",
				"table-name"
			])) : a("", !0)], 512),
			t.toolbarActions.length > 0 ? (y(), o("div", {
				key: 0,
				ref_key: "actionsContainerRef",
				ref: b,
				class: "relative"
			}, [s("button", {
				class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: g(t.isEmpty ? {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)",
					opacity: .4,
					cursor: "default"
				} : {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				}),
				disabled: t.isEmpty,
				onClick: r[7] ||= (e) => !t.isEmpty && (_.value = !_.value)
			}, [
				r[20] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M8 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" })], -1),
				l(" " + C(t.toolbarActionsLabel) + " ", 1),
				r[21] ||= s("svg", {
					class: "w-3 h-3 opacity-60",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)
			], 12, tt), _.value ? (y(), o("div", nt, [(y(!0), o(e, null, S(t.toolbarActions, (t, n) => (y(), o(e, { key: t.key ?? `divider-${n}` }, [t.divider ? (y(), o("div", rt)) : (y(), o("button", {
				key: 1,
				class: "w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2",
				style: g({
					color: "var(--st-text)",
					opacity: t.disabled ? .4 : 1,
					cursor: t.disabled ? "not-allowed" : "pointer"
				}),
				disabled: t.disabled,
				onClick: (e) => E(t)
			}, [t.icon ? (y(), o("span", {
				key: 0,
				class: "shrink-0 flex items-center",
				innerHTML: t.icon
			}, null, 8, at)) : a("", !0), s("span", ot, C(t.label), 1)], 12, it))], 64))), 128))])) : a("", !0)], 512)) : a("", !0),
			s("div", {
				ref_key: "columnsContainerRef",
				ref: w,
				class: "relative"
			}, [s("button", {
				class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: g(t.isEmpty ? {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)",
					opacity: .4,
					cursor: "default"
				} : k.value ? {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				} : {
					border: "1px solid var(--st-accent-border)",
					color: "var(--st-accent)",
					backgroundColor: "var(--st-accent-bg)"
				}),
				disabled: t.isEmpty,
				onClick: r[8] ||= (e) => !t.isEmpty && (m.value = !m.value)
			}, [r[22] ||= s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zM1 3.5a.5.5 0 01.5-.5H5v10H1.5a.5.5 0 01-.5-.5v-9zM6 13V3h4v10H6zm5 0V3h3.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H11z" })], -1), k.value ? (y(), o(e, { key: 0 }, [l("Columns")], 64)) : (y(), o(e, { key: 1 }, [l(C(O.value) + " hidden", 1)], 64))], 12, st), m.value ? (y(), i(Ze, {
				key: 0,
				table: t.table,
				"column-visibility": t.columnVisibility,
				"default-column-visibility": t.defaultColumnVisibility,
				"sub-table-columns": j.value,
				"sub-table-column-visibility": t.subTableColumnVisibility,
				"table-name": t.tableName,
				"onUpdate:columnVisibility": r[9] ||= (e) => d("update:column-visibility", e),
				"onUpdate:subTableColumnVisibility": r[10] ||= (e) => d("update:sub-table-column-visibility", e),
				onClose: r[11] ||= (e) => m.value = !1
			}, null, 8, [
				"table",
				"column-visibility",
				"default-column-visibility",
				"sub-table-columns",
				"sub-table-column-visibility",
				"table-name"
			])) : a("", !0)], 512),
			t.editable.insert ? (y(), o("div", {
				key: 1,
				ref_key: "insertContainerRef",
				ref: T,
				class: "relative"
			}, [t.defaultInsertLabel && t.insertActions.length > 0 ? (y(), o("button", {
				key: 0,
				class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[12] ||= (e) => p.value = !p.value
			}, [l(C(t.defaultInsertLabel) + " ", 1), r[23] ||= s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)])) : t.defaultInsertLabel ? (y(), o("button", {
				key: 1,
				class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[13] ||= (e) => d("insert-row")
			}, C(t.defaultInsertLabel), 1)) : (y(), o("button", {
				key: 2,
				class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[14] ||= (e) => p.value = !p.value
			}, [...r[24] ||= [l(" Insert ", -1), s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])), p.value ? (y(), o("div", ct, [t.insertActions.length > 0 ? (y(!0), o(e, { key: 0 }, S(t.insertActions, (e) => (y(), o("button", {
				key: e.key,
				class: "flex items-center gap-2 whitespace-nowrap text-left px-3 py-1.5 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: (t) => {
					d("insert-action", e.key), p.value = !1;
				}
			}, [e.icon ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 shrink-0 flex items-center justify-center",
				innerHTML: e.icon
			}, null, 8, ut)) : a("", !0), s("span", dt, C(e.label), 1)], 8, lt))), 128)) : (y(), o(e, { key: 1 }, [
				s("button", {
					class: "whitespace-nowrap text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[15] ||= (e) => {
						d("insert-row"), p.value = !1;
					}
				}, " Insert row "),
				s("button", {
					class: "whitespace-nowrap text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[16] ||= (e) => p.value = !1
				}, " Insert column "),
				r[25] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				s("button", {
					class: "whitespace-nowrap text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[17] ||= (e) => p.value = !1
				}, " Import data from CSV ")
			], 64))])) : a("", !0)], 512)) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-7857cf96"]]);
//#endregion
//#region src/components/DataTable/rowActionDestructive.js
function pt(e) {
	return typeof e != "object" || !e || e.divider === !0 ? !1 : e.danger === !0 || e.variant === "destructive" ? !0 : /^delete/i.test(String(e.key ?? ""));
}
//#endregion
//#region src/components/DataTable/SelectionToolbar.vue
var mt = {
	class: "px-3 py-1.5 flex items-center gap-2",
	style: {
		borderBottom: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)"
	}
}, ht = {
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, gt = {
	key: 0,
	class: "absolute top-full left-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, _t = {
	key: 0,
	class: "my-1",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, vt = ["disabled", "onClick"], yt = ["innerHTML"], bt = ["onClick"], xt = /* @__PURE__ */ V({
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
		contextMenuActions: {
			type: Array,
			default: () => []
		},
		enableSelectAll: {
			type: Boolean,
			default: !0
		},
		totalFilteredCount: {
			type: Number,
			default: null
		},
		countLabelSingular: {
			type: String,
			default: "record"
		},
		countLabelPlural: {
			type: String,
			default: "records"
		},
		enableSelectAllMatching: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"delete-confirm-request",
		"selection-action",
		"select-all-matching",
		"clear-full-selection"
	],
	setup(t, { emit: n }) {
		let i = d("tableSourceRows", null), c = t, u = r(() => c.totalFilteredCount == null ? (i != null && w(i), c.table.getFilteredRowModel().rows.length) : c.totalFilteredCount), f = r(() => c.selectedCount >= u.value && u.value > 0), p = n, m = x(!1), _ = x(null);
		z(_, () => {
			m.value = !1;
		});
		function v() {
			return c.table.getSelectedRowModel().rows.map((e) => e.original);
		}
		function b(e) {
			let t = v(), n = "";
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
			navigator.clipboard.writeText(n), m.value = !1;
		}
		function E(e) {
			let t = v(), n = "", r = "", i = "";
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
			s.href = o, s.download = i, s.click(), URL.revokeObjectURL(o), m.value = !1;
		}
		function D(e) {
			if (e == null || e.divider) return !1;
			let t = e.disabled;
			return t == null || typeof t == "function" ? !1 : !!t;
		}
		function O(e) {
			e.divider || D(e) || (p("selection-action", e.key, v()), m.value = !1);
		}
		function k(e) {
			p("selection-action", e.key, v()), m.value = !1;
		}
		return (n, r) => (y(), o("div", mt, [
			s("span", ht, C(t.selectedCount) + " row" + C(t.selectedCount > 1 ? "s" : "") + " selected", 1),
			t.editable.delete ? (y(), o("button", {
				key: 0,
				class: "flex items-center gap-1.5 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid rgba(239,68,68,0.4)",
					color: "#ef4444",
					"background-color": "rgba(239,68,68,0.1)"
				},
				onClick: r[0] ||= (e) => p("delete-confirm-request")
			}, [...r[11] ||= [s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z" })], -1), l(" Delete... ", -1)]])) : a("", !0),
			s("div", {
				ref_key: "actionsDropdownRef",
				ref: _,
				class: "relative"
			}, [s("button", {
				class: "flex items-center gap-1 px-2.5 py-1 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				onClick: r[1] ||= (e) => m.value = !m.value
			}, [...r[12] ||= [l(" Actions ", -1), s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]]), m.value ? (y(), o("div", gt, [
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[2] ||= (e) => b("csv")
				}, "Copy as CSV"),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[3] ||= (e) => b("sql")
				}, "Copy as SQL"),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[4] ||= (e) => b("json")
				}, "Copy as JSON"),
				r[15] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[5] ||= (e) => E("csv")
				}, "Download as CSV"),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[6] ||= (e) => E("tsv")
				}, "Download as TSV"),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[7] ||= (e) => E("json")
				}, "Download as JSON"),
				t.contextMenuActions.length > 0 ? (y(), o(e, { key: 0 }, [r[13] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1), (y(!0), o(e, null, S(t.contextMenuActions, (t, n) => (y(), o(e, { key: t.divider ? `divider-${n}` : t.key }, [t.divider ? (y(), o("div", _t)) : (y(), o("button", {
					key: 1,
					type: "button",
					class: h(["w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2 disabled:pointer-events-none", { "opacity-40 cursor-not-allowed": D(t) }]),
					disabled: D(t),
					style: g({ color: T(pt)(t) ? "var(--st-danger)" : "var(--st-text)" }),
					onClick: (e) => O(t)
				}, [t.icon ? (y(), o("span", {
					key: 0,
					class: "shrink-0 w-3.5 h-3.5 inline-flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full",
					innerHTML: t.icon
				}, null, 8, yt)) : a("", !0), s("span", null, C(t.label), 1)], 14, vt))], 64))), 128))], 64)) : a("", !0),
				t.selectionActions.length > 0 ? (y(), o(e, { key: 1 }, [r[14] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1), (y(!0), o(e, null, S(t.selectionActions, (e) => (y(), o("button", {
					key: e.key,
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: (t) => k(e)
				}, C(e.label), 9, bt))), 128))], 64)) : a("", !0)
			])) : a("", !0)], 512),
			s("button", {
				class: "text-[13px] transition-colors",
				style: { color: "var(--st-text-secondary)" },
				onClick: r[8] ||= (e) => p("clear-full-selection")
			}, " Clear selection "),
			t.enableSelectAllMatching && t.totalFilteredCount != null && !f.value ? (y(), o("button", {
				key: 1,
				class: "text-[13px] transition-colors",
				style: { color: "var(--st-accent)" },
				type: "button",
				onClick: r[9] ||= (e) => p("select-all-matching")
			}, " Select all " + C(u.value) + " " + C(u.value === 1 ? t.countLabelSingular : t.countLabelPlural), 1)) : t.enableSelectAll && !t.enableSelectAllMatching && !f.value ? (y(), o("button", {
				key: 2,
				class: "text-[13px] transition-colors",
				style: { color: "var(--st-accent)" },
				type: "button",
				onClick: r[10] ||= (e) => t.table.toggleAllRowsSelected(!0)
			}, " Select all " + C(u.value) + " " + C(u.value === 1 ? t.countLabelSingular : t.countLabelPlural), 1)) : a("", !0),
			r[16] ||= s("div", { class: "flex-1" }, null, -1)
		]));
	}
}, [["__scopeId", "data-v-10f6e0bb"]]), St = 22, Ct = 40;
function wt(e) {
	return !Array.isArray(e) || e.length === 0 ? 0 : e.reduce((e, t) => t && typeof t == "object" && t.icon ? e + St : e + Ct, 0);
}
//#endregion
//#region src/components/DataTable/TableColumnHeader.vue
var Tt = { class: "flex items-center gap-1.5 px-2 py-1.5 cursor-default overflow-hidden" }, Et = {
	class: "shrink-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Dt = {
	key: 0,
	class: "text-xs font-normal truncate min-w-0",
	style: { color: "var(--st-text-tertiary)" }
}, Ot = {
	key: 1,
	class: "text-xs shrink-0",
	style: { color: "var(--st-accent)" }
}, kt = {
	key: 2,
	class: "shrink-0 text-xs",
	style: { color: "var(--st-text-tertiary)" },
	title: "Column is frozen"
}, At = /* @__PURE__ */ V({
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
		function w() {
			p.value = !1;
		}
		function E() {
			n.header.column.toggleSorting(!1), w();
		}
		function D() {
			n.header.column.toggleSorting(!0), w();
		}
		function O() {
			navigator.clipboard.writeText(n.header.column.id), w();
		}
		function k() {
			b && (b.isFrozen = !b.isFrozen), w();
		}
		function A(e) {
			let t = n.header.getResizeHandler();
			t && t(e);
		}
		function j() {
			let e = n.header.column.id, t = _.value;
			if (typeof document > "u" || !t) return;
			let i = document.createElement("canvas").getContext("2d");
			if (!i) return;
			let a = getComputedStyle(t).fontFamily;
			i.font = `13px ${a && a.trim() !== "" ? a : "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif"}`;
			let o = n.header.column, s = o.columnDef.meta || {}, c = typeof o.columnDef.header == "string" ? o.columnDef.header : String(o.id), l = i.measureText(c).width;
			if (r && s.type && (l += 6 + i.measureText(String(s.type)).width), !(s.type === "boolean" && !s.badge || s.progressBar)) {
				let e = o.columnDef.accessorKey ?? o.id, t = n.table.getFilteredRowModel().rows;
				for (let n = 0; n < t.length; n++) {
					let r = t[n].original?.[e];
					if (r == null) continue;
					let a = i.measureText(String(r)).width;
					a > l && (l = a);
				}
			}
			Array.isArray(s.cellButtons) && s.cellButtons.length > 0 && (l += wt(s.cellButtons));
			let u = Math.ceil(l) + 16 + 28, d = Math.min(Math.max(u, 60), 500);
			n.table.options.onColumnSizingChange((t) => ({
				...t,
				[e]: d
			}));
		}
		return (n, d) => (y(), o("th", {
			ref_key: "thRef",
			ref: _,
			class: "relative z-[21] text-left font-normal select-none group/header",
			style: g({
				width: `${e.header.getSize()}px`,
				minWidth: `${e.header.getSize()}px`,
				backgroundColor: "var(--st-bg-header)",
				borderBottom: T(u) ? "1px solid var(--st-border)" : "none",
				borderRight: T(f) ? "1px solid var(--st-border)" : "none"
			})
		}, [
			s("div", Tt, [
				s("span", Et, [e.header.isPlaceholder ? a("", !0) : (y(), i(T(N), {
					key: 0,
					render: e.header.column.columnDef.header,
					props: e.header.getContext()
				}, null, 8, ["render", "props"]))]),
				T(r) ? (y(), o("span", Dt, C(T(b).type), 1)) : a("", !0),
				e.header.column.getIsSorted() ? (y(), o("span", Ot, C(e.header.column.getIsSorted() === "asc" ? "↑" : "↓"), 1)) : a("", !0),
				T(b).isFrozen ? (y(), o("span", kt, "❄")) : a("", !0),
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
				onClick: w
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
				}, "❄", -1), l(" " + C(T(b).isFrozen ? "Unfreeze column" : "Freeze column"), 1)])
			], 4)) : a("", !0)])),
			s("div", {
				class: h(["absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500", { "bg-blue-500": e.header.column.getIsResizing() }]),
				onMousedown: A,
				onTouchstart: A,
				onDblclick: M(j, ["stop"])
			}, null, 34)
		], 4));
	}
}, [["__scopeId", "data-v-d19d2667"]]), jt = ["title"], Mt = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, Nt = {
	key: 1,
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, Pt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, Ft = {
	class: "absolute -bottom-7 left-0 flex items-center gap-1 rounded shadow-lg px-2 py-1 z-20 text-xs whitespace-nowrap",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, It = {
	key: 0,
	class: "flex items-center min-w-0"
}, Lt = {
	key: 1,
	class: "flex items-center gap-2 min-w-0"
}, Rt = {
	class: "rounded-full overflow-hidden flex shrink-0 flex-nowrap",
	style: {
		height: "6px",
		width: "80px",
		backgroundColor: "var(--st-border-secondary)"
	}
}, zt = {
	class: "flex flex-col shrink-0",
	style: { gap: "1px" }
}, Bt = {
	key: 3,
	class: "flex items-center gap-2"
}, Vt = {
	class: "flex-1 rounded-full overflow-hidden",
	style: {
		height: "6px",
		backgroundColor: "var(--st-border-secondary)"
	}
}, Ht = {
	class: "text-xs shrink-0 tabular-nums",
	style: { color: "var(--st-text-secondary)" }
}, Ut = {
	class: "flex flex-col gap-0.5 flex-1 min-w-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Wt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, Gt = {
	key: 2,
	class: "block whitespace-pre-wrap break-words"
}, Kt = ["title"], qt = ["title"], Jt = ["innerHTML"], Yt = ["title", "onClick"], Xt = ["innerHTML"], Zt = { key: 1 }, Qt = {
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
		let i = [
			"badge",
			"cellButtons",
			"progressBar",
			"segmentedBar",
			"suffixIcon",
			"secondaryText",
			"overflow",
			"multiline"
		], c = t, u = d("editable", !0), p = d("showRowBorders", !0), _ = d("showColumnBorders", !0), v = d("cellButtonVisibility", "hover"), b = d("cellOverflow", "truncate"), w = d("getCellPendingState", () => null), E = d("getCellPreviousValue", () => void 0), D = d("getRowPendingState", () => null), k = r(() => w(c.cell.row.id, c.cell.column.id)), A = r(() => D(c.cell.row.id)), j = r(() => E(c.cell.row.id, c.cell.column.id)), N = r(() => k.value === "modified"), P = r(() => A.value === "delete"), F = r(() => {
			let e = f(v) ? v.value : v;
			return e === "always" ? "opacity-100" : e === "select" ? c.isSelected ? "opacity-100" : "opacity-0" : "opacity-0 group-hover/row:opacity-100";
		}), I = n, L = x(!1), R = x(""), z = x(null), B = {}, V = d("originalColumnMetaById", null), H = r(() => {
			let e = String(c.cell.column.id), t = V?.value?.[e], n = c.cell.column.columnDef.meta || {};
			if (!t) return Object.keys(n).length ? n : B;
			let r = {
				...t,
				...n
			};
			for (let e of i) (r[e] === void 0 || r[e] === null) && t[e] != null && (r[e] = t[e]);
			return typeof r.badge != "function" && r.badge !== !0 && typeof t.badge == "function" && (r.badge = t.badge), r.suffixIcon == null && t.suffixIcon != null && (r.suffixIcon = t.suffixIcon), r.secondaryText == null && t.secondaryText != null && (r.secondaryText = t.secondaryText), typeof r.secondaryText != "function" && typeof r.secondaryText != "string" && typeof t.secondaryText == "function" && (r.secondaryText = t.secondaryText), typeof r.segmentedBar != "function" && typeof t.segmentedBar == "function" && (r.segmentedBar = t.segmentedBar), r;
		}), te = r(() => H.value.type === "boolean"), ne = r(() => {
			let e = H.value;
			if (!e.progressBar) return null;
			let t = c.cell.getValue();
			if (t == null) return null;
			if (typeof e.progressBar == "function") return Math.min(100, Math.max(0, e.progressBar(t, c.cell.row.original)));
			if (typeof e.progressBar == "object" && e.progressBar !== null) {
				let { min: n = 0, max: r = 100 } = e.progressBar;
				return Math.min(100, Math.max(0, (t - n) / (r - n) * 100));
			}
			return Math.min(100, Math.max(0, Number(t)));
		}), U = r(() => {
			let e = H.value;
			if (!e.segmentedBar || typeof e.segmentedBar != "function") return null;
			let t = c.cell.getValue(), n = c.cell.row.original;
			return e.segmentedBar(t, n) ?? null;
		});
		function W(e, t) {
			if (!t || t <= 0) return "0%";
			let n = e / t * 100;
			return `${Math.min(100, Math.max(0, n))}%`;
		}
		let G = r(() => {
			let e = H.value;
			return e.overflow ? e.overflow : e.multiline ? "wrap" : (f(b) ? b.value : b) || "truncate";
		}), K = r(() => H.value.cellButtons ?? []);
		function re(e) {
			let t = e && e.color !== void 0 ? e.color : null;
			return t ? {
				backgroundColor: `color-mix(in srgb, ${t} 15%, transparent)`,
				color: t,
				border: `1px solid color-mix(in srgb, ${t} 35%, transparent)`
			} : {
				backgroundColor: "var(--st-border-secondary)",
				color: "var(--st-text)",
				border: "1px solid var(--st-border)"
			};
		}
		let q = r(() => {
			let e = H.value;
			if (!e.badge) return null;
			let t = c.cell.getValue(), n = c.cell.row.original, r = e.badge;
			if (typeof r == "function") {
				if (r = r(t, n), r == null || r === !1) return null;
			} else if (r === !0) r = {};
			else if (typeof r != "object" || !r) return null;
			let i = re(r), a;
			return a = r.label != null && r.label !== "" ? String(r.label) : t == null ? "NULL" : typeof t == "boolean" ? t ? "True" : "False" : String(t), {
				style: i,
				text: a
			};
		}), ie = r(() => te.value && !H.value.badge), J = r(() => {
			let e = H.value;
			if (!e.suffixIcon) return null;
			let t = c.cell.getValue();
			return typeof e.suffixIcon == "function" ? e.suffixIcon(t, c.cell.row.original) || null : e.suffixIcon;
		}), ae = r(() => {
			let e = H.value;
			if (e.secondaryText == null || e.secondaryText === "") return null;
			let t = c.cell.getValue(), n = c.cell.row.original, r;
			if (r = typeof e.secondaryText == "function" ? e.secondaryText(t, n) : e.secondaryText, r == null) return null;
			let i = String(r).trim();
			return i === "" ? null : i;
		}), oe = r(() => c.cell.getValue() == null), se = r(() => ae.value ? oe.value ? !0 : !q.value : !1), ce = r(() => se.value ? "flex items-start gap-1 min-w-0" : "flex items-center gap-1 min-w-0");
		function le() {
			L.value || I("select");
		}
		function ue() {
			!u.value?.update || ie.value || H.value.progressBar || H.value.segmentedBar || K.value.length > 0 || (L.value = !0, I("editing-change", !0), R.value = c.cell.getValue() ?? "", m(() => {
				z.value && (z.value.focus(), z.value.select(), de());
			}));
		}
		function de() {
			z.value && (z.value.style.height = "auto", z.value.style.height = z.value.scrollHeight + "px");
		}
		function fe() {
			let e = H.value.type;
			I("update", e === "int8" || e === "int4" || e === "float8" ? Number(R.value) : R.value), L.value = !1, I("editing-change", !1);
		}
		function Y() {
			L.value = !1, I("editing-change", !1);
		}
		function pe(e) {
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), fe()) : e.key === "Escape" && Y();
		}
		function me() {
			u.value?.update && I("update", !c.cell.getValue());
		}
		return (n, r) => (y(), o("div", {
			class: "px-2 py-1.5 relative cursor-default align-middle",
			style: g({
				display: "table-cell",
				width: `${t.cell.column.getSize()}px`,
				minWidth: `${t.cell.column.getSize()}px`,
				maxWidth: `${t.cell.column.getSize()}px`,
				overflow: "hidden",
				borderBottom: T(p) ? "1px solid var(--st-border)" : "none",
				borderRight: T(_) ? "1px solid var(--st-border)" : "none",
				boxShadow: t.isSelected && !L.value ? "inset 0 0 0 2px var(--st-accent)" : N.value ? "inset 3px 0 0 var(--st-accent)" : "none",
				zIndex: L.value ? 20 : t.isSelected ? 10 : "auto"
			}),
			title: N.value && j.value !== void 0 ? `Was: ${j.value === null || j.value === "" ? "(empty)" : j.value}` : void 0,
			onClick: le,
			onDblclick: ue
		}, [ie.value ? (y(), o(e, { key: 0 }, [T(u).update ? (y(), o("button", {
			key: 0,
			class: "flex items-center gap-1.5",
			onClick: M(me, ["stop"])
		}, [s("span", {
			class: "inline-block w-7 h-4 rounded-full relative transition-colors",
			style: g({ backgroundColor: t.cell.getValue() ? "var(--st-accent)" : "var(--st-toggle-off)" })
		}, [s("span", { class: h(["absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", t.cell.getValue() ? "left-3.5" : "left-0.5"]) }, null, 2)], 4), s("span", Mt, C(t.cell.getValue() ? "true" : "false"), 1)])) : (y(), o("span", Nt, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Pt, "NULL")) : (y(), o(e, { key: 1 }, [l(C(t.cell.getValue() ? "true" : "false"), 1)], 64))]))], 64)) : L.value ? (y(), o(e, { key: 1 }, [ee(s("textarea", {
			ref_key: "textareaRef",
			ref: z,
			"onUpdate:modelValue": r[0] ||= (e) => R.value = e,
			class: "w-full rounded px-1.5 py-1 text-[13px] resize-none outline-none",
			style: {
				backgroundColor: "var(--st-bg-input)",
				color: "var(--st-text)",
				border: "1px solid var(--st-accent)"
			},
			rows: "1",
			onKeydown: pe,
			onInput: de
		}, null, 544), [[O, R.value]]), s("div", Ft, [
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-accent)" },
				onClick: M(fe, ["stop"])
			}, " ↵ Save "),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-text-secondary)" },
				onClick: M(Y, ["stop"])
			}, " Esc Cancel ")
		])], 64)) : U.value ? (y(), o(e, { key: 2 }, [U.value.total === 0 ? (y(), o("div", It, [...r[2] ||= [s("span", {
			class: "italic text-[13px]",
			style: { color: "var(--st-text-placeholder)" }
		}, "—", -1)]])) : (y(), o("div", Lt, [s("div", Rt, [(y(!0), o(e, null, S(U.value.segments, (e) => (y(), o("div", {
			key: e.label,
			class: "h-full shrink-0",
			style: g({
				width: W(e.count, U.value.total),
				backgroundColor: e.color
			})
		}, null, 4))), 128))]), s("div", zt, [(y(!0), o(e, null, S(U.value.segments, (e) => (y(), o("span", {
			key: e.label,
			class: "text-[11px] leading-snug tabular-nums whitespace-nowrap",
			style: { color: "var(--st-text-secondary)" }
		}, C(e.count) + " " + C(e.label), 1))), 128))])]))], 64)) : ne.value === null ? (y(), o("div", {
			key: 4,
			class: h(ce.value),
			style: g(P.value ? {
				textDecoration: "line-through",
				opacity: .5
			} : {})
		}, [
			s("div", Ut, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Wt, "NULL")) : q.value ? (y(), o("span", {
				key: 1,
				class: "inline-flex shrink-0 self-start items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight",
				style: g(q.value.style)
			}, C(q.value.text), 5)) : G.value === "wrap" ? (y(), o("span", Gt, C(t.cell.getValue()), 1)) : (y(), o("span", {
				key: 3,
				class: "truncate block",
				title: String(t.cell.getValue())
			}, C(t.cell.getValue()), 9, Kt)), se.value ? (y(), o("span", {
				key: 4,
				class: h(["block text-[11px] leading-snug", G.value === "wrap" ? "whitespace-pre-wrap break-words" : "truncate"]),
				style: { color: "var(--st-text-secondary)" },
				title: G.value === "wrap" ? void 0 : ae.value
			}, C(ae.value), 11, qt)) : a("", !0)]),
			J.value ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 shrink-0 flex items-center justify-center",
				style: g({ color: J.value.color || "var(--st-text-secondary)" }),
				innerHTML: J.value.svg
			}, null, 12, Jt)) : a("", !0),
			K.value.length > 0 ? (y(), o("div", {
				key: 1,
				class: h(["flex items-center gap-0.5 shrink-0", F.value])
			}, [(y(!0), o(e, null, S(K.value, (e, n) => (y(), o("button", {
				key: n,
				type: "button",
				class: h(["flex items-center justify-center rounded transition-colors", e.icon ? "w-5 h-5 shrink-0" : "h-5 px-1.5 shrink-0 text-[11px] font-medium whitespace-nowrap"]),
				style: { color: "var(--st-text-secondary)" },
				title: e.label,
				onClick: M((n) => e.onClick(t.cell.row.original), ["stop"])
			}, [e.icon ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 flex items-center justify-center",
				innerHTML: e.icon
			}, null, 8, Xt)) : (y(), o("span", Zt, C(e.label), 1))], 10, Yt))), 128))], 2)) : a("", !0)
		], 6)) : (y(), o("div", Bt, [s("div", Vt, [s("div", {
			class: "h-full rounded-full transition-all duration-300",
			style: g({
				width: `${ne.value}%`,
				backgroundColor: "var(--st-accent)"
			})
		}, null, 4)]), s("span", Ht, C(Math.round(ne.value)) + "% ", 1)]))], 44, jt));
	}
}, $t = ["data-index"], en = {
	class: "group/row",
	style: {
		display: "table",
		tableLayout: "fixed",
		width: "100%"
	}
}, tn = { class: "flex h-full gap-1 pr-1.5 pl-1 items-center justify-end pl-0.5" }, nn = { class: "flex min-w-0 flex-1 items-center justify-end gap-0.5" }, rn = {
	class: "text-xs text-right whitespace-nowrap",
	style: { color: "var(--st-text-tertiary)" }
}, an = ["checked"], on = /* @__PURE__ */ V({
	__name: "TableGridDataRow",
	props: {
		row: {
			type: Object,
			required: !0
		},
		rowIndex: {
			type: Number,
			required: !0
		},
		orderNumber: {
			type: Number,
			required: !0
		},
		virtualOffsetY: {
			type: Number,
			default: null
		},
		totalTableWidth: {
			type: Number,
			required: !0
		},
		selectedCell: {
			type: String,
			default: null
		},
		editingRowId: {
			type: [
				String,
				Number,
				null
			],
			default: null
		}
	},
	emits: [
		"toggle-row-select",
		"edit-row",
		"context-menu",
		"select-cell",
		"update-cell",
		"editing-change"
	],
	setup(t) {
		let n = t, c = d("editable", !0), l = r(() => {
			let e = T(c);
			return e === !0 ? {
				insert: !0,
				update: !0,
				delete: !0
			} : e === !1 ? {
				insert: !1,
				update: !1,
				delete: !1
			} : {
				insert: !0,
				update: !0,
				delete: !0,
				...e
			};
		}), f = d("showRowBorders", !0), m = d("showColumnBorders", !0), _ = d("getSubTable", null), v = d("expanded", {}), b = d("toggleRowExpanded", () => {}), x = d("nestingDepth", 0), E = d("parentTheme", "dark"), D = d("parentAccentColor", "#3ecf8e"), O = d("subTableSorting", {}), k = d("subTableColumnFilters", {}), A = d("subTableColumnVisibility", {}), j = d("getRowPendingState", () => null), ee = d("isRowDisplayedSelected", null);
		function N(e) {
			let t = T(ee);
			return typeof t == "function" ? t(e) : e.getIsSelected();
		}
		let P = r(() => {
			let e = m ? "inset -1px 0 0 var(--st-border)" : "", t = "2px 0 4px var(--st-shadow-sticky)";
			return e ? `${e}, ${t}` : t;
		}), F = r(() => _ ? _(n.row.original) : null), I = r(() => {
			let e = F.value;
			if (!e) return {
				tableProps: null,
				onRowAction: null
			};
			let { onRowAction: t, ...n } = e;
			return {
				tableProps: n,
				onRowAction: typeof t == "function" ? t : null
			};
		}), L = r(() => T(v) ?? {});
		function R() {
			return !!F.value;
		}
		function z() {
			return !!L.value?.[n.row.id];
		}
		let B = r(() => n.virtualOffsetY == null ? { width: "100%" } : {
			position: "absolute",
			top: "0px",
			left: "0px",
			width: "100%",
			transform: `translateY(${n.virtualOffsetY}px)`,
			zIndex: n.editingRowId === n.row.id ? 5 : "auto"
		});
		return (n, r) => (y(), o("div", {
			class: h(["st-row", {
				"st-row--selected": N(t.row),
				"st-row--pending-insert": T(j)(t.row.id) === "insert",
				"st-row--pending-delete": T(j)(t.row.id) === "delete"
			}]),
			style: g(B.value),
			"data-index": t.virtualOffsetY == null ? void 0 : t.rowIndex
		}, [s("div", en, [
			s("div", {
				class: "py-1.5 align-middle sticky left-0 z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "44px",
					minWidth: "44px",
					borderBottom: T(f) ? "1px solid var(--st-border)" : "none"
				})
			}, [s("div", tn, [s("div", nn, [R() ? (y(), o("button", {
				key: 0,
				class: "flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150",
				style: g({
					color: z() ? "var(--st-accent)" : "var(--st-text-secondary)",
					transform: z() ? "rotate(90deg)" : "rotate(0deg)"
				}),
				title: "Toggle sub-table",
				onClick: r[0] ||= M((e) => T(b)(t.row.id), ["stop"])
			}, [...r[5] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6 3l5 5-5 5V3z" })], -1)]], 4)) : l.value.update ? (y(), o("button", {
				key: 1,
				class: "invisible group-hover/row:visible flex items-center justify-center w-4 h-4 shrink-0",
				style: { color: "var(--st-text-secondary)" },
				title: "Expand row",
				onClick: r[1] ||= M((e) => n.$emit("edit-row", t.row.original), ["stop"])
			}, [...r[6] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2"
			}, [s("path", { d: "M6 2h8v8M14 2L6 10" })], -1)]])) : a("", !0), s("span", rn, C(t.orderNumber), 1)])])], 4),
			s("div", {
				class: "px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "40px",
					minWidth: "40px",
					left: "44px",
					borderBottom: T(f) ? "1px solid var(--st-border)" : "none",
					boxShadow: P.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: N(t.row),
				onClick: r[2] ||= (e) => n.$emit("toggle-row-select", t.row, e, t.rowIndex)
			}, null, 8, an)], 4),
			(y(!0), o(e, null, S(t.row.getVisibleCells(), (e) => (y(), i(Qt, {
				key: e.id,
				cell: e,
				"is-selected": t.selectedCell === `${t.row.id}:${e.column.id}`,
				onSelect: (r) => n.$emit("select-cell", t.row.id, e.column.id),
				onUpdate: (r) => n.$emit("update-cell", t.row.id, e.column.id, r),
				onEditingChange: r[3] ||= (e) => n.$emit("editing-change", e, t.row.id),
				onContextmenu: M((r) => n.$emit("context-menu", r, t.row, e), ["prevent", "stop"])
			}, null, 8, [
				"cell",
				"is-selected",
				"onSelect",
				"onUpdate",
				"onContextmenu"
			]))), 128))
		]), z() && F.value ? (y(), o("div", {
			key: 0,
			style: g({
				display: "block",
				width: t.totalTableWidth + "px",
				borderBottom: T(f) ? "1px solid var(--st-border)" : "none"
			})
		}, [s("div", { style: g({
			borderLeft: "3px solid var(--st-accent)",
			marginLeft: 10 + Number(w(T(x)) || 0) * 16 + "px",
			backgroundColor: "var(--st-bg)"
		}) }, [u(Vr, p(I.value.tableProps, {
			editable: F.value.editable ?? {
				insert: !1,
				update: !1,
				delete: !1
			},
			theme: F.value.theme ?? T(T(E)),
			"accent-color": F.value.accentColor ?? T(T(D)),
			"nesting-depth": T(x) + 1,
			"controlled-sorting": T(O),
			"controlled-column-filters": T(k),
			"controlled-column-visibility": T(A),
			onRowAction: r[4] ||= (e, t) => I.value.onRowAction?.(e, t)
		}), null, 16, [
			"editable",
			"theme",
			"accent-color",
			"nesting-depth",
			"controlled-sorting",
			"controlled-column-filters",
			"controlled-column-visibility"
		])], 4)], 4)) : a("", !0)], 14, $t));
	}
}, [["__scopeId", "data-v-91bf3b1e"]]), sn = 36, cn = 56, ln = 40, un = 300, dn = {
	__name: "TableGridVirtualRows",
	props: {
		rows: {
			type: Array,
			required: !0
		},
		scrollElementRef: {
			type: Object,
			required: !0
		},
		totalTableWidth: {
			type: Number,
			required: !0
		},
		selectedCell: {
			type: String,
			default: null
		},
		editingRowId: {
			type: [
				String,
				Number,
				null
			],
			default: null
		},
		paginationState: {
			type: Object,
			required: !0
		}
	},
	emits: [
		"toggle-row-select",
		"edit-row",
		"context-menu",
		"select-cell",
		"update-cell",
		"editing-change"
	],
	setup(t, { emit: n }) {
		let a = t, s = n, c = d("cellOverflow", "truncate"), l = d("getSubTable", null), u = d("expanded"), f = typeof window < "u" && "onscrollend" in window, p = r(() => T(u) ?? {}), m = B(r(() => {
			let e = a.rows, t = p.value, n = T(c) === "wrap", r = {}, i = l;
			if (i) for (let t of e) {
				let e = i(t.original);
				e && (r[t.id] = e);
			}
			return {
				count: e.length,
				getScrollElement: () => T(a.scrollElementRef),
				estimateSize: (i) => {
					let a = e[i];
					if (!a) return sn;
					let o = n ? cn : sn;
					return r[a.id] ? t[a.id] ? Math.max(o, un) : Math.max(o, ln) : o;
				},
				overscan: 8,
				getItemKey: (t) => e[t]?.id ?? t,
				useScrollendEvent: f,
				isScrollingResetDelay: f ? 100 : 150
			};
		})), h = r(() => m.value.getVirtualItems()), _ = r(() => m.value.getTotalSize());
		function v(e, t) {
			if (!e || t == null) return;
			let n = e.$el ?? e;
			!n || typeof n.setAttribute != "function" || (n.setAttribute("data-index", String(t.index)), m.value.measureElement(n));
		}
		function b(e) {
			return a.paginationState.pageIndex * a.paginationState.pageSize + e + 1;
		}
		return (n, r) => (y(), o("div", { style: g({
			position: "relative",
			height: _.value + "px",
			width: t.totalTableWidth + "px"
		}) }, [(y(!0), o(e, null, S(h.value, (e) => (y(), i(on, {
			key: e.key,
			ref_for: !0,
			ref: (t) => v(t, e),
			row: t.rows[e.index],
			"row-index": e.index,
			"order-number": b(e.index),
			"virtual-offset-y": e.start,
			"total-table-width": t.totalTableWidth,
			"selected-cell": t.selectedCell,
			"editing-row-id": t.editingRowId,
			onToggleRowSelect: r[0] ||= (e, t, n) => s("toggle-row-select", e, t, n),
			onEditRow: r[1] ||= (e) => s("edit-row", e),
			onContextMenu: r[2] ||= (e, t, n) => s("context-menu", e, t, n),
			onSelectCell: r[3] ||= (e, t) => s("select-cell", e, t),
			onUpdateCell: r[4] ||= (e, t, n) => s("update-cell", e, t, n),
			onEditingChange: r[5] ||= (e, t) => s("editing-change", e, t)
		}, null, 8, [
			"row",
			"row-index",
			"order-number",
			"virtual-offset-y",
			"total-table-width",
			"selected-cell",
			"editing-row-id"
		]))), 128))], 4));
	}
}, fn = {
	__name: "TableGridFlowRows",
	props: {
		rows: {
			type: Array,
			required: !0
		},
		totalTableWidth: {
			type: Number,
			required: !0
		},
		selectedCell: {
			type: String,
			default: null
		},
		editingRowId: {
			type: [
				String,
				Number,
				null
			],
			default: null
		},
		paginationState: {
			type: Object,
			required: !0
		}
	},
	emits: [
		"toggle-row-select",
		"edit-row",
		"context-menu",
		"select-cell",
		"update-cell",
		"editing-change"
	],
	setup(t, { emit: n }) {
		let r = n;
		function a(e, t) {
			return t.pageIndex * t.pageSize + e + 1;
		}
		return (n, s) => (y(), o("div", {
			class: "flex flex-col",
			style: g({ width: t.totalTableWidth + "px" })
		}, [(y(!0), o(e, null, S(t.rows, (e, n) => (y(), i(on, {
			key: e.id,
			row: e,
			"row-index": n,
			"order-number": a(n, t.paginationState),
			"total-table-width": t.totalTableWidth,
			"selected-cell": t.selectedCell,
			"editing-row-id": t.editingRowId,
			onToggleRowSelect: s[0] ||= (e, t, n) => r("toggle-row-select", e, t, n),
			onEditRow: s[1] ||= (e) => r("edit-row", e),
			onContextMenu: s[2] ||= (e, t, n) => r("context-menu", e, t, n),
			onSelectCell: s[3] ||= (e, t) => r("select-cell", e, t),
			onUpdateCell: s[4] ||= (e, t, n) => r("update-cell", e, t, n),
			onEditingChange: s[5] ||= (e, t) => r("editing-change", e, t)
		}, null, 8, [
			"row",
			"row-index",
			"order-number",
			"total-table-width",
			"selected-cell",
			"editing-row-id"
		]))), 128))], 4));
	}
}, pn = ["checked", "indeterminate"], mn = {
	key: 0,
	class: "absolute inset-0 flex items-center justify-center pointer-events-none",
	style: { top: "33px" }
}, hn = { class: "flex flex-col items-center gap-4 text-center px-6 pointer-events-auto" }, gn = {
	class: "flex items-center justify-center w-14 h-14 rounded-2xl",
	style: {
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, _n = {
	class: "w-7 h-7",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { color: "var(--st-accent)" }
}, vn = { class: "flex flex-col gap-1" }, yn = {
	class: "font-semibold text-[15px]",
	style: { color: "var(--st-text)" }
}, bn = {
	class: "text-[13px] max-w-xs leading-relaxed",
	style: { color: "var(--st-text-tertiary)" }
}, xn = {
	key: 0,
	class: "relative mt-1"
}, Sn = {
	key: 1,
	class: "flex items-center"
}, Cn = {
	key: 3,
	class: "absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, wn = 500, Tn = 8, En = /* @__PURE__ */ V({
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
	setup(n, { expose: c, emit: u }) {
		let f = [
			60,
			75,
			85,
			55,
			70,
			80,
			65,
			90
		];
		function p(e, t) {
			return f[(e + t) % f.length];
		}
		let m = n, _ = d("editable", !0), v = r(() => {
			let e = T(_);
			return e === !0 ? {
				insert: !0,
				update: !0,
				delete: !0
			} : e === !1 ? {
				insert: !1,
				update: !1,
				delete: !1
			} : {
				insert: !0,
				update: !0,
				delete: !0,
				...e
			};
		}), b = d("showRowBorders", !0), D = d("showColumnBorders", !0), O = d("loading", !1), k = r(() => !!T(O)), A = d("emptyTitle", "No rows found"), j = d("emptyMessage", "Get started by inserting a new row."), ee = d("openInsertPanel", null), N = d("defaultInsertLabel", null), P = d("insertActions", null), F = r(() => {
			let e = P == null ? [] : T(P);
			return Array.isArray(e) ? e : [];
		}), I = r(() => !v.value.insert || !(N != null && String(T(N)).trim()) ? !1 : F.value.length === 0), L = d("insertRow", () => {}), R = x(!1), z = d("nestingDepth", 0), B = u, V = x(null), H = x(null), te = d("tableSourceRows", null), ne = r(() => (te != null && w(te), m.table.getHeaderGroups())), U = r(() => 84 + m.table.getVisibleLeafColumns().reduce((e, t) => e + t.getSize(), 0)), W = r(() => (te != null && w(te), m.table.getRowModel().rows)), G = r(() => (te != null && w(te), m.table.getVisibleLeafColumns())), K = r(() => m.table.getState().pagination), re = d("isRowDisplayedSelected", null);
		function q(e) {
			let t = T(re);
			return typeof t == "function" ? t(e) : e.getIsSelected();
		}
		let ie = r(() => W.value.length ? W.value.every((e) => q(e)) : !1), J = r(() => {
			if (!W.value.length) return !1;
			let e = W.value.some((e) => q(e)), t = W.value.every((e) => q(e));
			return e && !t;
		});
		function ae(e, t) {
			V.value = `${e}:${t}`;
		}
		function oe() {
			V.value = null;
		}
		function se(e, t, n) {
			B("context-menu", e, t, n);
		}
		function ce() {
			m.table.toggleAllPageRowsSelected(!ie.value);
		}
		let le = x(null);
		function ue(e, t, n) {
			if (t?.shiftKey && le.value !== null) {
				let e = Math.min(le.value, n), t = Math.max(le.value, n), r = W.value;
				for (let n = e; n <= t; n++) r[n].toggleSelected(!0);
			} else e.toggleSelected(!q(e));
			le.value = n;
		}
		let de = r(() => {
			let e = D ? "inset -1px 0 0 var(--st-border)" : "", t = "2px 0 4px var(--st-shadow-sticky)";
			return e ? `${e}, ${t}` : t;
		}), fe = r(() => W.value.length > wn), Y = E("scroller");
		function pe(e, t) {
			H.value = e ? t : null;
		}
		function me() {
			let e = Y.value;
			if (!e) return null;
			let t = w(z);
			return t && t > 0 ? e.parentElement : e;
		}
		function he() {
			return me()?.clientWidth ?? 0;
		}
		return c({
			getScrollViewportInnerWidth: he,
			getViewportResizeObserveTarget: me
		}), (r, c) => (y(), o("div", { class: h(T(z) === 0 ? "flex-1 min-h-0 relative" : "overflow-auto") }, [s("div", {
			ref: "scroller",
			class: h(T(z) === 0 ? "absolute inset-0 overflow-auto flex flex-col items-start min-h-0" : "flex flex-col items-start"),
			style: { "scrollbar-gutter": "stable" },
			onClick: M(oe, ["self"])
		}, [s("div", {
			class: "sticky top-0 z-[26] shrink-0 isolate",
			style: g({
				width: U.value + "px",
				backgroundColor: "var(--st-bg-header)"
			})
		}, [s("table", {
			class: "border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent",
			style: g({ width: U.value + "px" })
		}, [s("thead", null, [(y(!0), o(e, null, S(ne.value, (t) => (y(), o("tr", { key: t.id }, [
			s("th", {
				class: "px-1.5 py-1.5 text-right font-normal sticky left-0 z-[40]",
				style: g({
					width: "44px",
					minWidth: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: T(b) ? "1px solid var(--st-border)" : "none",
					color: "var(--st-text-tertiary)"
				})
			}, [...c[12] ||= [s("span", { class: "text-xs" }, "#", -1)]], 4),
			s("th", {
				class: "px-1 py-1.5 text-center align-middle sticky z-[39]",
				style: g({
					width: "40px",
					minWidth: "40px",
					left: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: T(b) ? "1px solid var(--st-border)" : "none",
					boxShadow: de.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: ie.value,
				indeterminate: J.value,
				title: "Select all rows on this page",
				onChange: ce
			}, null, 40, pn)], 4),
			(y(!0), o(e, null, S(t.headers, (e) => (y(), i(At, {
				key: e.id,
				header: e,
				table: n.table
			}, null, 8, ["header", "table"]))), 128))
		]))), 128))])], 4)], 4), W.value.length > 0 && fe.value ? (y(), i(dn, {
			key: 0,
			rows: W.value,
			"scroll-element-ref": Y.value,
			"total-table-width": U.value,
			"selected-cell": V.value,
			"editing-row-id": H.value,
			"pagination-state": K.value,
			onToggleRowSelect: ue,
			onEditRow: c[0] ||= (e) => B("edit-row", e),
			onContextMenu: se,
			onSelectCell: ae,
			onUpdateCell: c[1] ||= (e, t, n) => B("update-cell", e, t, n),
			onEditingChange: pe
		}, null, 8, [
			"rows",
			"scroll-element-ref",
			"total-table-width",
			"selected-cell",
			"editing-row-id",
			"pagination-state"
		])) : W.value.length > 0 ? (y(), i(fn, {
			key: 1,
			rows: W.value,
			"total-table-width": U.value,
			"selected-cell": V.value,
			"editing-row-id": H.value,
			"pagination-state": K.value,
			onToggleRowSelect: ue,
			onEditRow: c[2] ||= (e) => B("edit-row", e),
			onContextMenu: se,
			onSelectCell: ae,
			onUpdateCell: c[3] ||= (e, t, n) => B("update-cell", e, t, n),
			onEditingChange: pe
		}, null, 8, [
			"rows",
			"total-table-width",
			"selected-cell",
			"editing-row-id",
			"pagination-state"
		])) : k.value ? (y(), o("div", {
			key: 2,
			class: "shrink-0",
			style: g({ width: U.value + "px" })
		}, [s("table", {
			class: "border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent",
			style: g({ width: U.value + "px" })
		}, [s("tbody", null, [(y(), o(e, null, S(Tn, (t) => s("tr", { key: t }, [
			s("td", {
				class: "sticky left-0 z-10 py-1.5 align-middle",
				style: g({
					width: "44px",
					minWidth: "44px",
					backgroundColor: "var(--st-bg)",
					borderBottom: T(b) ? "1px solid var(--st-border)" : "none"
				})
			}, null, 4),
			s("td", {
				class: "sticky z-10 px-1 py-1.5 text-center align-middle",
				style: g({
					width: "40px",
					minWidth: "40px",
					left: "44px",
					backgroundColor: "var(--st-bg)",
					borderBottom: T(b) ? "1px solid var(--st-border)" : "none",
					boxShadow: de.value
				})
			}, null, 4),
			(y(!0), o(e, null, S(G.value, (e, n) => (y(), o("td", {
				key: e.id,
				class: "px-2 py-1.5 align-middle",
				style: g({
					width: e.getSize() + "px",
					borderBottom: T(b) ? "1px solid var(--st-border)" : "none",
					backgroundColor: "var(--st-bg)"
				})
			}, [s("div", {
				class: "animate-pulse rounded max-w-full",
				style: g({
					width: p(t - 1, n) + "%",
					height: "12px",
					backgroundColor: "var(--st-border-secondary)"
				})
			}, null, 4)], 4))), 128))
		])), 64))])], 4)], 4)) : a("", !0)], 2), W.value.length === 0 && !k.value ? (y(), o("div", mn, [s("div", hn, [
			s("div", gn, [(y(), o("svg", _n, [...c[13] ||= [s("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}, null, -1), s("path", { d: "M3 9h18M3 15h18M9 9v9M15 9v9" }, null, -1)]]))]),
			s("div", vn, [s("p", yn, C(T(A)), 1), s("p", bn, C(T(j)), 1)]),
			v.value.insert ? (y(), o("div", xn, [
				I.value ? (y(), o("button", {
					key: 0,
					class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[4] ||= (e) => T(L)()
				}, C(T(N)), 1)) : T(N) ? (y(), o("div", Sn, [s("button", {
					class: "flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[5] ||= (e) => T(L)()
				}, C(T(N)), 1), s("button", {
					class: "flex items-center self-stretch px-1.5 rounded-r transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)",
						borderLeft: "1px solid var(--st-accent-hover)"
					},
					onClick: c[6] ||= (e) => R.value = !R.value
				}, [...c[14] ||= [s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])])) : (y(), o("button", {
					key: 2,
					class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[7] ||= (e) => R.value = !R.value
				}, [...c[15] ||= [l(" Insert ", -1), s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])),
				R.value ? (y(), o("div", Cn, [
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[8] ||= (e) => {
							T(ee)(), R.value = !1;
						}
					}, " Insert row "),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[9] ||= (e) => R.value = !1
					}, " Insert column "),
					c[16] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[10] ||= (e) => R.value = !1
					}, " Import data from CSV ")
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [R.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[11] ||= (e) => R.value = !1
				})) : a("", !0)]))
			])) : a("", !0)
		])])) : a("", !0)], 2));
	}
}, [["__scopeId", "data-v-c262480e"]]), Dn = {
	class: "px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0",
	style: {
		borderTop: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)",
		color: "var(--st-text-secondary)"
	}
}, On = ["disabled"], kn = { class: "flex items-center gap-1.5" }, An = ["value", "max"], jn = {
	key: 1,
	class: "tabular-nums",
	style: { color: "var(--st-text)" }
}, Mn = ["disabled"], Nn = { class: "flex items-center gap-1.5" }, Pn = ["value"], Fn = {
	class: "tabular-nums px-2 py-0.5 rounded",
	style: {
		color: "var(--st-accent)",
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, In = ["disabled"], Ln = ["disabled"], Rn = {
	key: 0,
	class: "w-3 h-3 animate-spin",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2"
}, zn = { style: { color: "var(--st-text-tertiary)" } }, Bn = {
	class: "text-[13px] mb-4",
	style: { color: "var(--st-text-secondary)" }
}, Vn = { class: "flex items-center justify-end gap-2" }, Hn = {
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
		},
		countLabelSingular: {
			type: String,
			default: "record"
		},
		countLabelPlural: {
			type: String,
			default: "records"
		}
	},
	emits: ["commit", "discard"],
	setup(n, { emit: c }) {
		let u = d("themeVars", {}), f = d("tableSourceRows", null), p = n, m = c, h = r(() => p.table.getState().pagination.pageIndex), _ = r(() => p.table.getState().pagination.pageSize), v = r(() => p.totalCount !== null && p.totalCount !== void 0 && Number.isFinite(Number(p.totalCount))), b = r(() => {
			if (v.value) {
				let e = Math.max(1, _.value), t = Number(p.totalCount), n = Math.ceil(t / e);
				return Math.max(1, n);
			}
			return p.table.getPageCount();
		}), S = r(() => v.value ? h.value > 0 : p.table.getCanPreviousPage()), E = r(() => v.value ? h.value + 1 < b.value : p.table.getCanNextPage()), D = r(() => p.totalCount !== null && p.totalCount !== void 0 ? p.totalCount : (f != null && w(f), p.table.getFilteredRowModel().rows.length));
		function O(e) {
			let t = Math.max(0, Math.min(e, b.value - 1));
			p.table.setPageIndex(t);
		}
		function k(e) {
			let t = parseInt(e.target.value, 10);
			isNaN(t) || O(t - 1);
		}
		let A = x(!1);
		function j() {
			p.pendingEditCount !== 0 && (A.value = !0);
		}
		function ee() {
			m("discard"), A.value = !1;
		}
		return (r, c) => (y(), o("div", Dn, [
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !S.value,
				onClick: c[0] ||= (e) => n.table.previousPage()
			}, [...c[6] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" })], -1)]], 8, On),
			s("div", kn, [
				c[7] ||= s("span", null, "Page", -1),
				n.hasRandomAccess ? (y(), o("input", {
					key: 0,
					type: "number",
					value: h.value + 1,
					min: "1",
					max: b.value,
					class: "w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					style: {
						backgroundColor: "var(--st-bg-input)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					},
					onChange: k
				}, null, 40, An)) : (y(), o("span", jn, C(h.value + 1), 1)),
				s("span", null, "of " + C(b.value), 1)
			]),
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !E.value,
				onClick: c[1] ||= (e) => n.table.nextPage()
			}, [...c[8] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" })], -1)]], 8, Mn),
			c[14] ||= s("div", {
				class: "w-px h-4 mx-1",
				style: { backgroundColor: "var(--st-border)" }
			}, null, -1),
			s("div", Nn, [c[10] ||= s("span", null, "Rows per page:", -1), s("select", {
				value: _.value,
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
			]], 40, Pn)]),
			c[15] ||= s("div", { class: "flex-1" }, null, -1),
			n.stagedEdits && n.pendingEditCount > 0 ? (y(), o(e, { key: 0 }, [
				s("span", Fn, C(n.pendingEditCount) + " pending change" + C(n.pendingEditCount === 1 ? "" : "s"), 1),
				s("button", {
					class: "px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						backgroundColor: "transparent"
					},
					disabled: n.committing,
					onClick: j
				}, " Clear edits ", 8, In),
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					disabled: n.committing,
					onClick: c[3] ||= (e) => m("commit")
				}, [n.committing ? (y(), o("svg", Rn, [...c[11] ||= [s("path", {
					d: "M8 1.5a6.5 6.5 0 1 1-6.5 6.5",
					"stroke-linecap": "round"
				}, null, -1)]])) : a("", !0), l(" " + C(n.committing ? "Committing…" : "Commit"), 1)], 8, Ln),
				c[12] ||= s("div", {
					class: "w-px h-4 mx-1",
					style: { backgroundColor: "var(--st-border)" }
				}, null, -1)
			], 64)) : a("", !0),
			s("span", zn, C(D.value.toLocaleString()) + " " + C(D.value === 1 ? n.countLabelSingular : n.countLabelPlural), 1),
			(y(), i(t, { to: "body" }, [A.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-[100] flex items-center justify-center",
				style: g({
					...T(u),
					backgroundColor: "var(--st-bg-overlay)"
				}),
				onClick: c[5] ||= M((e) => A.value = !1, ["self"])
			}, [s("div", {
				class: "rounded-lg shadow-xl p-5 w-80",
				style: g({
					...T(u),
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				})
			}, [
				c[13] ||= s("h3", { class: "font-semibold text-[14px] mb-2" }, "Clear all pending edits?", -1),
				s("p", Bn, " This will discard " + C(n.pendingEditCount) + " pending change" + C(n.pendingEditCount === 1 ? "" : "s") + ". This action cannot be undone. ", 1),
				s("div", Vn, [s("button", {
					class: "px-3 py-1 rounded text-[13px]",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					},
					onClick: c[4] ||= (e) => A.value = !1
				}, " Cancel "), s("button", {
					class: "px-3 py-1 rounded text-[13px] font-medium",
					style: {
						"background-color": "#ef4444",
						color: "white"
					},
					onClick: ee
				}, " Clear edits ")])
			], 4)], 4)) : a("", !0)]))
		]));
	}
}, Un = {
	class: "px-5 py-4 flex items-center justify-between",
	style: { borderBottom: "1px solid var(--st-border)" }
}, Wn = { class: "flex items-center gap-2" }, Gn = {
	class: "text-sm",
	style: { color: "var(--st-text)" }
}, Kn = {
	class: "rounded px-2 py-0.5 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-input)",
		border: "1px solid var(--st-border-secondary)",
		color: "var(--st-text-secondary)"
	}
}, qn = { class: "flex-1 overflow-auto px-5 py-4" }, Jn = {
	key: 0,
	class: "mb-6"
}, Yn = { class: "flex items-start gap-4" }, Xn = { class: "w-40 shrink-0 pt-2" }, Zn = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, Qn = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, $n = { class: "flex-1" }, er = ["disabled", "onClick"], tr = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, nr = ["value"], rr = ["onUpdate:modelValue", "placeholder"], ir = { key: 1 }, ar = { class: "flex items-start gap-4" }, or = { class: "w-40 shrink-0 pt-2" }, sr = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, cr = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, lr = { class: "flex-1" }, ur = ["disabled", "onClick"], dr = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, fr = ["value"], pr = ["onUpdate:modelValue", "placeholder"], mr = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border)" }
}, hr = {
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
		}))), p = r(() => l.mode === "insert" ? f.value.filter((e) => e.meta.insertable !== !1) : f.value), m = r(() => p.value.filter((e) => e.meta.isNullable === !1)), b = r(() => p.value.filter((e) => e.meta.isNullable !== !1)), w = x({});
		function E() {
			let e = {};
			f.value.forEach((t) => {
				l.mode === "update" && l.rowData ? e[t.id] = l.rowData[t.id] ?? "" : t.meta.defaultValue === void 0 ? e[t.id] = t.meta.type === "boolean" ? !1 : "" : e[t.id] = t.meta.defaultValue;
			}), w.value = e;
		}
		E();
		function D() {
			let e = { ...w.value };
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
			s("div", Un, [s("div", Wn, [s("span", Gn, C(t.mode === "insert" ? "Insert row into" : "Update row from"), 1), s("code", Kn, C(t.tableName), 1)]), s("button", {
				class: "w-6 h-6 flex items-center justify-center",
				style: { color: "var(--st-text-tertiary)" },
				onClick: r[0] ||= (e) => u("close")
			}, [...r[2] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])]),
			s("div", qn, [m.value.length > 0 ? (y(), o("div", Jn, [(y(!0), o(e, null, S(m.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", Yn, [s("div", Xn, [s("div", Zn, C(n.id), 1), s("div", Qn, C(n.meta.type), 1)]), s("div", $n, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (w.value[n.id] = !w.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: w.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", w.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", tr, C(w.value[n.id] ? "true" : "false"), 1)], 10, er)) : (y(), o(e, { key: 1 }, [n.meta.isPrimaryKey && t.mode === "update" || n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: w.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, nr)) : ee((y(), o("textarea", {
				key: 1,
				"onUpdate:modelValue": (e) => w.value[n.id] = e,
				class: "w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				},
				rows: "1",
				placeholder: n.meta.placeholder ?? ""
			}, null, 8, rr)), [[O, w.value[n.id]]])], 64))])])]))), 128))])) : a("", !0), b.value.length > 0 ? (y(), o("div", ir, [r[3] ||= s("div", { class: "mb-3" }, [s("h3", {
				class: "text-sm font-medium",
				style: { color: "var(--st-text)" }
			}, "Optional Fields"), s("p", {
				class: "text-xs mt-0.5",
				style: { color: "var(--st-text-tertiary)" }
			}, "These are columns that do not need any value")], -1), (y(!0), o(e, null, S(b.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", ar, [s("div", or, [s("div", sr, C(n.id), 1), s("div", cr, C(n.meta.type), 1)]), s("div", lr, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (w.value[n.id] = !w.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: w.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", w.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", dr, C(w.value[n.id] ? "true" : "false"), 1)], 10, ur)) : (y(), o(e, { key: 1 }, [n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: w.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, fr)) : ee((y(), o("textarea", {
				key: 1,
				"onUpdate:modelValue": (e) => w.value[n.id] = e,
				class: "w-full rounded px-3 py-2 text-[13px] outline-none resize-y min-h-[36px]",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				},
				rows: "1",
				placeholder: n.meta.placeholder ?? "NULL"
			}, null, 8, pr)), [[O, w.value[n.id]]])], 64))])])]))), 128))])) : a("", !0)]),
			s("div", mr, [s("button", {
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
}, gr = {
	class: "w-52 rounded shadow-xl py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, _r = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, vr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, yr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, br = {
	key: 0,
	class: "my-1",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, xr = ["disabled", "onClick"], Sr = ["innerHTML"], Cr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, wr = /* @__PURE__ */ V({
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
		},
		customActions: {
			type: Array,
			default: () => []
		},
		allowRowEdit: {
			type: Boolean,
			default: !1
		},
		allowRowDelete: {
			type: Boolean,
			default: !1
		}
	},
	emits: [
		"close",
		"edit-row",
		"delete-row",
		"filter-by-value",
		"undo-row",
		"undo-cell",
		"row-action"
	],
	setup(n, { emit: c }) {
		let u = d("themeVars", {}), f = d("getRowPendingState", () => null), p = d("getCellPendingState", () => null), m = n, b = c, w = r(() => m.row ? f(m.row.id) : null), E = r(() => m.row && m.cell ? p(m.row.id, m.cell.column.id) : null), D = r(() => w.value === "insert" ? "Discard new row" : w.value === "delete" ? "Restore row" : w.value === "update" ? "Undo row changes" : null), O = x(null), k = r(() => m.cell ? m.cell.getValue() : null), A = r(() => m.cell ? m.cell.column.id : null);
		function j(e) {
			if (navigator.clipboard && document.hasFocus()) navigator.clipboard.writeText(e);
			else {
				let t = document.createElement("textarea");
				t.value = e, t.style.cssText = "position:fixed;opacity:0;pointer-events:none", document.body.appendChild(t), t.focus(), t.select(), document.execCommand("copy"), document.body.removeChild(t);
			}
		}
		function ee() {
			k.value !== null && k.value !== void 0 && j(String(k.value)), b("close");
		}
		function M() {
			m.row && j(JSON.stringify(m.row.original, null, 2)), b("close");
		}
		function N() {
			A.value && k.value !== null && k.value !== void 0 && b("filter-by-value", A.value, String(k.value)), b("close");
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
			A.value && b("undo-cell", A.value), b("close");
		}
		function R() {
			return m.row?.original ?? null;
		}
		function B(e, t) {
			if (e == null || e.divider) return !1;
			let n = e.disabled;
			if (n == null) return !1;
			let r = t?.original ?? t ?? null;
			return typeof n == "function" ? !!n(r) : !!n;
		}
		function V(e) {
			B(e, m.row) || (b("row-action", e.key, R()), b("close"));
		}
		z(O, () => {
			b("close");
		});
		function H(e) {
			e.key === "Escape" && b("close");
		}
		_(() => {
			document.addEventListener("keydown", H);
		}), v(() => {
			document.removeEventListener("keydown", H);
		});
		let te = r(() => {
			let e = window.innerWidth, t = window.innerHeight, n = {
				position: "fixed",
				zIndex: 9999
			};
			return m.y > t / 2 ? n.bottom = `${t - m.y}px` : n.top = `${m.y}px`, m.x > e / 2 ? n.right = `${e - m.x}px` : n.left = `${m.x}px`, n;
		});
		return (r, c) => (y(), i(t, { to: "body" }, [s("div", {
			ref_key: "menuRef",
			ref: O,
			style: g({
				...T(u),
				...te.value
			})
		}, [s("div", gr, [
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: ee
			}, [(y(), o("svg", _r, [...c[0] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), c[1] ||= l(" Copy cell ", -1)]),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: M
			}, [(y(), o("svg", vr, [...c[2] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), c[3] ||= l(" Copy row ", -1)]),
			c[14] ||= s("div", {
				class: "my-1",
				style: { borderTop: "1px solid var(--st-border-secondary)" }
			}, null, -1),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: N
			}, [(y(), o("svg", yr, [...c[4] ||= [s("path", { d: "M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" }, null, -1)]])), c[5] ||= l(" Filter by value ", -1)]),
			E.value === "modified" || D.value ? (y(), o(e, { key: 0 }, [
				c[8] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				E.value === "modified" ? (y(), o("button", {
					key: 0,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-accent)" },
					onClick: L
				}, [...c[6] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [s("path", { d: "M3 7h7a4 4 0 0 1 0 8H6" }), s("path", { d: "M6 4L3 7l3 3" })], -1), l(" Undo cell change ", -1)]])) : a("", !0),
				D.value ? (y(), o("button", {
					key: 1,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-accent)" },
					onClick: I
				}, [c[7] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "none",
					stroke: "currentColor",
					"stroke-width": "2",
					"stroke-linecap": "round",
					"stroke-linejoin": "round"
				}, [s("path", { d: "M3 7h7a4 4 0 0 1 0 8H6" }), s("path", { d: "M6 4L3 7l3 3" })], -1), l(" " + C(D.value), 1)])) : a("", !0)
			], 64)) : a("", !0),
			n.customActions.length > 0 ? (y(), o(e, { key: 1 }, [c[9] ||= s("div", {
				class: "my-1",
				style: { borderTop: "1px solid var(--st-border-secondary)" }
			}, null, -1), (y(!0), o(e, null, S(n.customActions, (t, n) => (y(), o(e, { key: t.divider ? `divider-${n}` : t.key }, [t.divider ? (y(), o("div", br)) : (y(), o("button", {
				key: 1,
				type: "button",
				class: h(["w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item disabled:pointer-events-none", { "opacity-40 cursor-not-allowed": B(t, m.row) }]),
				disabled: B(t, m.row),
				style: g({ color: T(pt)(t) ? "var(--st-danger)" : "var(--st-text)" }),
				onClick: (e) => V(t)
			}, [t.icon ? (y(), o("span", {
				key: 0,
				class: "shrink-0 w-3.5 h-3.5 inline-flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full",
				innerHTML: t.icon
			}, null, 8, Sr)) : a("", !0), s("span", null, C(t.label), 1)], 14, xr))], 64))), 128))], 64)) : a("", !0),
			n.allowRowEdit || n.allowRowDelete ? (y(), o(e, { key: 2 }, [
				c[13] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				n.allowRowEdit ? (y(), o("button", {
					key: 0,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: P
				}, [(y(), o("svg", Cr, [...c[10] ||= [s("path", { d: "M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z" }, null, -1)]])), c[11] ||= l(" Edit row ", -1)])) : a("", !0),
				n.allowRowDelete && w.value !== "delete" ? (y(), o("button", {
					key: 1,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "#ef4444" },
					onClick: F
				}, [...c[12] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M6.5 1.75a.25.25 0 01.25-.25h2.5a.25.25 0 01.25.25V3h-3V1.75zM11 3V1.75C11 .784 10.216 0 9.25 0h-2.5C5.784 0 5 .784 5 1.75V3H2.75a.75.75 0 000 1.5h.31l.72 9.678A1.75 1.75 0 005.525 16h4.95a1.75 1.75 0 001.745-1.822L12.94 4.5h.31a.75.75 0 000-1.5H11z" })], -1), l(" Delete row ", -1)]])) : a("", !0)
			], 64)) : a("", !0)
		])], 4)]));
	}
}, [["__scopeId", "data-v-3f2648fa"]]), Tr = { class: "px-5 pt-5 pb-4" }, Er = { style: { color: "var(--st-text-secondary)" } }, Dr = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, Or = {
	__name: "DeleteRowsConfirmDialog",
	props: {
		modelValue: {
			type: Boolean,
			default: !1
		},
		rowCount: {
			type: Number,
			required: !0
		}
	},
	emits: ["update:modelValue", "confirm"],
	setup(e, { emit: n }) {
		let r = d("themeVars", {}), c = n;
		function l() {
			c("update:modelValue", !1);
		}
		function u() {
			c("confirm");
		}
		return (n, c) => (y(), i(t, { to: "body" }, [e.modelValue ? (y(), o("div", {
			key: 0,
			class: "fixed inset-0 z-50 flex items-center justify-center",
			style: g({ ...T(r) })
		}, [s("div", {
			class: "fixed inset-0",
			style: { backgroundColor: "var(--st-bg-overlay)" },
			onClick: l
		}), s("div", {
			class: "relative rounded-lg shadow-2xl w-96 text-[13px]",
			style: g({
				...T(r),
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			})
		}, [s("div", Tr, [c[0] ||= s("h3", {
			class: "font-medium text-sm mb-2",
			style: { color: "var(--st-text)" }
		}, "Confirm deletion", -1), s("p", Er, " Are you sure you want to delete " + C(e.rowCount) + " row" + C(e.rowCount > 1 ? "s" : "") + "? This action cannot be undone. ", 1)]), s("div", Dr, [s("button", {
			type: "button",
			class: "px-3 py-1.5 rounded text-[13px] transition-colors",
			style: {
				border: "1px solid var(--st-border-secondary)",
				color: "var(--st-text-secondary)"
			},
			onClick: l
		}, " Cancel "), s("button", {
			type: "button",
			class: "px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium",
			onClick: u
		}, " Delete " + C(e.rowCount) + " row" + C(e.rowCount > 1 ? "s" : ""), 1)])], 4)], 4)) : a("", !0)]));
	}
}, kr = 60;
function Ar(e, t) {
	let n = e.length, r = {};
	if (n === 0) return r;
	let i = Math.max(kr * n, Math.floor(t)), a = Math.floor(i / n), o = i - a * n;
	return e.forEach((e, t) => {
		r[e] = a + +(t < o);
	}), r;
}
function jr(e, t, n) {
	let r = e.length;
	if (r === 0) return {};
	let i = Math.max(0, Math.floor(n)), a = t.reduce((e, t) => e + t, 0);
	if (a <= 0) return Ar(e, i);
	let o = t.map((e) => i * e / a), s = o.map((e) => Math.floor(e)), c = i - s.reduce((e, t) => e + t, 0), l = [...o.keys()].sort((e, t) => {
		let n = o[e] - s[e];
		return o[t] - s[t] - n;
	}), u = 0;
	for (; c > 0;) {
		let e = l[u % r];
		s[e] += 1, --c, u += 1;
	}
	let d = {};
	return e.forEach((e, t) => {
		d[e] = s[t];
	}), d;
}
//#endregion
//#region src/components/DataTable/contextMenuCoordinator.js
var Mr = null;
function Nr(e) {
	Mr && Mr !== e && Mr(), Mr = e;
}
function Pr(e) {
	Mr === e && (Mr = null);
}
//#endregion
//#region src/components/DataTable/DataTable.vue
var Fr = ["data-st-theme"], Ir = {
	key: 1,
	class: "flex items-center gap-2 px-3 py-2 text-[13px] shrink-0",
	style: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderBottom: "1px solid rgba(239,68,68,0.3)",
		color: "#ef4444"
	}
}, Lr = { class: "flex-1" }, Rr = { class: "flex flex-1 min-h-0 min-w-0" }, zr = { class: "flex flex-col flex-1 min-w-0 min-h-0" }, Br = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif", Vr = /* @__PURE__ */ V({
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
		contextMenuActions: {
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
		cellOverflow: {
			type: String,
			default: "truncate",
			validator: (e) => ["truncate", "wrap"].includes(e)
		},
		insertActions: {
			type: Array,
			default: () => []
		},
		countLabelSingular: {
			type: String,
			default: "record"
		},
		countLabelPlural: {
			type: String,
			default: "records"
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
		totalFilteredCount: {
			type: Number,
			default: null
		},
		additionalSelectedRowIds: {
			type: Array,
			default: () => []
		},
		enableSelectAllMatching: {
			type: Boolean,
			default: !1
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
		"row-action",
		"toolbar-action",
		"insert-action",
		"view-change",
		"update:expanded-rows",
		"sub-table-event",
		"column-resize",
		"page-change",
		"sort-change",
		"select-all-matching",
		"update:additionalSelectedRowIds",
		"update:column-filters",
		"commit-edits",
		"discard-edits"
	],
	setup(t, { expose: c, emit: l }) {
		let f = Symbol("dataTable.fontFamily"), p = t;
		function S(e, t) {
			let n = parseInt(e.replace("#", ""), 16), r = Math.max(0, (n >> 16) - t), i = Math.max(0, (n >> 8 & 255) - t), a = Math.max(0, (n & 255) - t);
			return `#${(r << 16 | i << 8 | a).toString(16).padStart(6, "0")}`;
		}
		function w(e) {
			let t = parseInt(e.replace("#", ""), 16), n = (t >> 16) / 255, r = (t >> 8 & 255) / 255, i = (t & 255) / 255;
			return .2126 * n + .7152 * r + .0722 * i;
		}
		let E = r(() => {
			let e = p.theme === "dark", t = p.accentColor, n = S(t, 20), r = w(t) > .4 ? "#000" : "#fff", i = `color-mix(in srgb, ${t} 10%, transparent)`, a = `color-mix(in srgb, ${t} 40%, transparent)`, o = `color-mix(in srgb, ${t} 30%, transparent)`;
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
				"--st-shadow-sticky": e ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.08)",
				"--st-danger": e ? "#f87171" : "#dc2626"
			};
		}), D = d(f, null), O = r(() => {
			if (p.fontFamily != null && String(p.fontFamily).trim() !== "") return String(p.fontFamily).trim();
			let e = D == null ? null : T(D);
			return e != null && String(e).trim() !== "" ? String(e).trim() : null;
		});
		b(f, O);
		let A = r(() => ({ "--dt-font-family": O.value || Br })), ee = r(() => ({
			...E.value,
			...A.value,
			backgroundColor: "var(--st-bg)",
			color: "var(--st-text)"
		})), M = x(null), N = x(null), z = x(!1), B = x([]), V = l, H = r(() => p.editable === !0 ? {
			insert: !0,
			update: !0,
			delete: !0
		} : p.editable === !1 ? {
			insert: !1,
			update: !1,
			delete: !1
		} : {
			insert: !0,
			update: !0,
			delete: !0,
			...p.editable
		}), te = r(() => H.value.update), ne = r(() => H.value.delete), U = x(!1);
		k(() => p.error, () => {
			U.value = !1;
		});
		let W = x(p.controlledSorting ?? []), G = x(p.controlledColumnFilters ?? p.columnFilters ?? []), K = x({}), re = x({
			pageIndex: 0,
			pageSize: 100
		}), q = x({}), ie = x({
			startOffset: null,
			startSize: null,
			deltaOffset: null,
			deltaPercentage: null,
			isResizingColumn: !1,
			columnSizingStart: []
		}), J = x(p.controlledColumnVisibility ?? { ...p.defaultColumnVisibility });
		k(() => p.controlledSorting, (e) => {
			e !== null && (W.value = e);
		}, { deep: !0 }), k(() => p.controlledColumnFilters, (e) => {
			e !== null && (G.value = e);
		}, { deep: !0 }), k(() => p.columnFilters, (e) => {
			e !== null && (G.value = e);
		}, { deep: !0 }), k(() => p.controlledColumnVisibility, (e) => {
			e !== null && (J.value = e);
		}, { deep: !0 });
		let ae = x([]), oe = x([]), se = x({}), ce = x({}), le = r(() => p.expandedRows ?? ce.value);
		function ue(e) {
			p.expandedRows === null ? ce.value = {
				...ce.value,
				[e]: !ce.value[e]
			} : V("update:expanded-rows", {
				...p.expandedRows,
				[e]: !p.expandedRows[e]
			});
		}
		function de(e, t, n) {
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
		let fe = r(() => {
			for (let e of p.columns) if (e.meta?.isPrimaryKey) return e.accessorKey ?? e.id ?? "id";
			return "id";
		}), Y = r(() => p.totalCount !== null), pe = r(() => p.totalFilteredCount == null ? p.totalCount : p.totalFilteredCount), me = r(() => new Set((p.additionalSelectedRowIds || []).map((e) => String(e)))), he = r(() => {
			let e = new Set((p.additionalSelectedRowIds || []).map(String));
			for (let t of Object.keys(K.value)) e.add(String(t));
			return e.size;
		});
		function ge() {
			let e = /* @__PURE__ */ new Set();
			for (let t of p.additionalSelectedRowIds || []) e.add(String(t));
			for (let t of Object.keys(K.value)) e.add(String(t));
			return [...e];
		}
		function _e(e) {
			let t = fe.value, n = String(e.original[t] ?? e.original.id);
			return e.getIsSelected() || me.value.has(n);
		}
		b("isRowDisplayedSelected", _e);
		let Z = x(/* @__PURE__ */ new Map()), ye = x(!1), be = 0;
		function xe() {
			return be += 1, `${ve}${Date.now()}_${be}`;
		}
		function Se(e) {
			let t = fe.value;
			return p.rows.find((n) => String(n[t] ?? n.id) === String(e));
		}
		let Ce = r(() => Z.value.size > 0), we = r(() => Z.value.size), Te = r(() => {
			if (!p.stagedEdits || Z.value.size === 0) return p.rows;
			let e = fe.value, t = [], n = p.rows.map((t) => {
				let n = String(t[e] ?? t.id), r = Z.value.get(n);
				return r && r.kind === X.UPDATE ? {
					...t,
					...r.changes
				} : t;
			});
			for (let [e, n] of Z.value) n.kind === X.INSERT && t.push({
				...n.changes,
				__stagedId: e
			});
			return [...n, ...t];
		});
		function Ee(e) {
			let t = xe(), n = new Map(Z.value);
			n.set(t, {
				kind: X.INSERT,
				changes: { ...e }
			}), Z.value = n;
		}
		function De(e, t) {
			let n = String(e), r = new Map(Z.value), i = r.get(n);
			if (i?.kind === X.INSERT) r.set(n, {
				kind: X.INSERT,
				changes: {
					...i.changes,
					...t
				}
			});
			else if (i?.kind === X.DELETE) {
				let e = i.snapshot ?? Se(n);
				r.set(n, {
					kind: X.UPDATE,
					changes: { ...t },
					snapshot: e
				});
			} else if (i?.kind === X.UPDATE) {
				let e = {
					...i.changes,
					...t
				}, a = i.snapshot;
				Object.keys(e).some((t) => e[t] !== a?.[t]) ? r.set(n, {
					kind: X.UPDATE,
					changes: e,
					snapshot: a
				}) : r.delete(n);
			} else {
				let e = Se(n);
				Object.keys(t).some((n) => t[n] !== e?.[n]) && r.set(n, {
					kind: X.UPDATE,
					changes: { ...t },
					snapshot: e
				});
			}
			Z.value = r;
		}
		function Oe(e) {
			let t = new Map(Z.value);
			for (let n of e) {
				let e = String(n), r = t.get(e);
				if (r?.kind === X.INSERT) t.delete(e);
				else {
					let n = r?.snapshot ?? Se(e);
					t.set(e, {
						kind: X.DELETE,
						snapshot: n
					});
				}
			}
			Z.value = t;
		}
		function ke(e) {
			let t = new Map(Z.value);
			t.delete(String(e)), Z.value = t;
		}
		function Ae(e, t) {
			let n = String(e), r = Z.value.get(n);
			if (!r || r.kind !== X.UPDATE) return;
			let { [t]: i, ...a } = r.changes, o = new Map(Z.value);
			Object.keys(a).length === 0 ? o.delete(n) : o.set(n, {
				...r,
				changes: a
			}), Z.value = o;
		}
		function je(e) {
			return Z.value.get(String(e))?.kind ?? null;
		}
		function Me(e, t) {
			let n = Z.value.get(String(e));
			return n && n.kind === X.UPDATE && t in n.changes ? "modified" : null;
		}
		function Ne(e, t) {
			let n = Z.value.get(String(e));
			if (!(!n || n.kind !== X.UPDATE)) return n.snapshot?.[t];
		}
		function Pe() {
			let e = [], t = [], n = [];
			for (let [r, i] of Z.value) i.kind === X.INSERT ? e.push({ ...i.changes }) : i.kind === X.UPDATE ? t.push({
				id: r,
				changes: { ...i.changes }
			}) : i.kind === X.DELETE && n.push(r);
			return {
				inserts: e,
				updates: t,
				deletes: n
			};
		}
		function Fe() {
			if (ye.value || !Ce.value) return;
			let e = Pe();
			ye.value = !0, V("commit-edits", e, (e) => {
				ye.value = !1, e && (Z.value = /* @__PURE__ */ new Map());
			});
		}
		function Ie() {
			Z.value = /* @__PURE__ */ new Map(), V("discard-edits");
		}
		let Q = R({
			data: Te,
			get columns() {
				return p.columns;
			},
			filterFns: { operator: de },
			defaultColumn: { filterFn: "operator" },
			state: {
				get sorting() {
					return W.value;
				},
				get columnFilters() {
					return G.value;
				},
				get rowSelection() {
					return K.value;
				},
				get pagination() {
					return re.value;
				},
				get columnSizing() {
					return q.value;
				},
				get columnSizingInfo() {
					return ie.value;
				},
				get columnVisibility() {
					return J.value;
				}
			},
			get manualSorting() {
				return Y.value;
			},
			get manualFiltering() {
				return Y.value;
			},
			onSortingChange: (e) => {
				W.value = typeof e == "function" ? e(W.value) : e, Y.value && V("sort-change", W.value);
			},
			onColumnFiltersChange: (e) => {
				G.value = typeof e == "function" ? e(G.value) : e, V("update:column-filters", G.value);
			},
			onRowSelectionChange: (e) => {
				let t = K.value, n = typeof e == "function" ? e(t) : e;
				if (Y.value && (p.additionalSelectedRowIds?.length ?? 0) > 0) {
					let e = new Set(Object.keys(t)), r = new Set(Object.keys(n)), i = [...e].filter((e) => !r.has(e));
					if (i.length > 0) {
						let e = p.additionalSelectedRowIds || [], t = new Set(e.map(String)), n = i.filter((e) => t.has(String(e)));
						if (n.length > 0) {
							let t = new Set(n.map(String));
							V("update:additionalSelectedRowIds", e.filter((e) => !t.has(String(e))));
						}
					}
				}
				K.value = n;
			},
			onPaginationChange: (e) => {
				let t = typeof e == "function" ? e(re.value) : e;
				re.value = t, Y.value && V("page-change", {
					pageIndex: t.pageIndex,
					pageSize: t.pageSize
				});
			},
			onColumnSizingChange: (e) => {
				q.value = typeof e == "function" ? e(q.value) : e;
			},
			onColumnSizingInfoChange: (e) => {
				let t = ie.value, n = typeof e == "function" ? e(t) : e;
				ie.value = n, t.isResizingColumn && !n.isResizingColumn && V("column-resize", q.value);
			},
			onColumnVisibilityChange: (e) => {
				J.value = typeof e == "function" ? e(J.value) : e;
			},
			getCoreRowModel: P(),
			getSortedRowModel: L(),
			getFilteredRowModel: F(),
			getPaginationRowModel: I(),
			get manualPagination() {
				return Y.value;
			},
			get pageCount() {
				if (Y.value) return Math.ceil(p.totalCount / re.value.pageSize);
			},
			enableRowSelection: !0,
			enableMultiRowSelection: !0,
			enableColumnResizing: !0,
			columnResizeMode: "onChange",
			getRowId: (e) => e.__stagedId ? String(e.__stagedId) : String(e[fe.value] ?? e.id)
		}), Le = r(() => {
			let e = Object.create(null);
			function t(n) {
				if (Array.isArray(n)) for (let r of n) {
					let n = r.id ?? r.accessorKey;
					n != null && r.meta && (e[String(n)] = r.meta), r.columns?.length && t(r.columns);
				}
			}
			return t(p.columns), e;
		});
		k(() => [
			p.rows,
			p.additionalSelectedRowIds,
			p.totalCount
		], () => {
			if (p.totalCount == null) return;
			let e = new Set((p.additionalSelectedRowIds || []).map(String));
			if (e.size === 0) return;
			let t = fe.value, n = { ...K.value }, r = !1;
			for (let i of p.rows) {
				let a = String(i[t] ?? i.id);
				e.has(a) && !n[a] && (n[a] = !0, r = !0);
			}
			r && (K.value = n);
		}, { deep: !0 });
		function Re() {
			Q.resetRowSelection(), V("update:additionalSelectedRowIds", []);
		}
		let ze = he, Be = r(() => he.value > 0), Ve = x({
			open: !1,
			mode: "insert",
			rowData: null
		});
		function He() {
			Ve.value = {
				open: !0,
				mode: "insert",
				rowData: null
			};
		}
		function Ue() {
			let e = p.defaultInsertLabel;
			if (typeof e == "string" && e.trim() !== "") {
				V("insert-row");
				return;
			}
			He();
		}
		function We(e) {
			Ve.value = {
				open: !0,
				mode: "update",
				rowData: { ...e }
			};
		}
		function Ge() {
			Ve.value = {
				open: !1,
				mode: "insert",
				rowData: null
			};
		}
		function Ke(e) {
			if (Ve.value.mode === "insert") p.stagedEdits ? Ee(e) : V("insert-row", e);
			else if (p.stagedEdits) {
				let t = fe.value, n = String(e[t] ?? e.id), r = Se(n) ?? {}, i = {};
				for (let n of Object.keys(e)) n !== t && e[n] !== r[n] && (i[n] = e[n]);
				Object.keys(i).length > 0 && De(n, i);
			} else V("update-row", {
				id: e.id,
				changes: e
			});
			Ge();
		}
		function qe(e) {
			p.stagedEdits ? Oe(e) : V("delete-rows", e), Q.resetRowSelection(), V("update:additionalSelectedRowIds", []);
		}
		function Je(e) {
			let t = (e ?? []).map(String).filter(Boolean);
			t.length !== 0 && (B.value = t, z.value = !0);
		}
		function Ye() {
			Je(ge());
		}
		function Xe() {
			let e = [...B.value];
			z.value = !1, qe(e);
		}
		k(z, (e) => {
			e || (B.value = []);
		});
		function Ze(e, t, n) {
			p.stagedEdits ? De(e, { [t]: n }) : V("update-row", {
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
		function Qe(e, t, n) {
			Nr($e), $.value = {
				show: !0,
				x: e.clientX,
				y: e.clientY,
				row: t,
				cell: n
			};
		}
		function $e() {
			$.value = {
				show: !1,
				x: 0,
				y: 0,
				row: null,
				cell: null
			}, Pr($e);
		}
		function et(e, t) {
			G.value.find((t) => t.id === e) ? G.value = G.value.map((n) => n.id === e ? {
				...n,
				value: {
					operator: "=",
					value: t
				}
			} : n) : G.value = [...G.value, {
				id: e,
				value: {
					operator: "=",
					value: t
				}
			}];
		}
		b("themeVars", r(() => ({
			...E.value,
			...A.value
		}))), b("originalColumnMetaById", Le), b("table", Q), b("tableSourceRows", Te), b("tableName", p.tableName), b("showDataTypes", p.showDataTypes), b("editable", H), b("showRowBorders", p.showRowBorders), b("showColumnBorders", p.showColumnBorders), b("cellButtonVisibility", r(() => p.cellButtonVisibility)), b("cellOverflow", r(() => p.cellOverflow)), b("insertRow", () => V("insert-row")), b("openInsertPanel", He), b("emptyTitle", r(() => p.emptyTitle)), b("emptyMessage", r(() => p.emptyMessage)), b("defaultInsertLabel", r(() => p.defaultInsertLabel)), b("insertActions", r(() => p.insertActions)), b("loading", r(() => p.loading)), b("expanded", le), b("toggleRowExpanded", ue), b("getSubTable", p.getSubTable), b("nestingDepth", p.nestingDepth), b("parentTheme", r(() => p.theme)), b("parentAccentColor", r(() => p.accentColor)), b("subTableSorting", ae), b("subTableColumnFilters", oe), b("subTableColumnVisibility", se), b("stagedEditsEnabled", r(() => p.stagedEdits)), b("getRowPendingState", je), b("getCellPendingState", Me), b("getCellPreviousValue", Ne), b("undoRowEdit", ke), b("undoCellEdit", Ae), k(() => p.rows, () => {
			Q.resetRowSelection();
		});
		function tt() {
			let e = {};
			if (typeof document > "u") return e;
			let t = document.createElement("canvas").getContext("2d");
			if (!t) return e;
			let n = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
			if (M.value) {
				let e = getComputedStyle(M.value).fontFamily;
				e && e.trim() !== "" && (n = e);
			}
			t.font = `13px ${n}`;
			let r = Q.getAllLeafColumns(), i = Te.value.slice(0, 200);
			for (let n of r) {
				let r = n.columnDef.meta || {}, a = typeof n.columnDef.header == "string" ? n.columnDef.header : String(n.id), o = t.measureText(a).width;
				p.showDataTypes && r.type && (o += 6 + t.measureText(r.type).width);
				let s = !!r.segmentedBar;
				if (!(r.type === "boolean" && !r.badge || r.progressBar || s)) {
					let e = n.columnDef.accessorKey ?? n.id;
					for (let n of i) {
						let r = n?.[e];
						if (r == null) continue;
						let i = t.measureText(String(r)).width;
						i > o && (o = i);
					}
				}
				Array.isArray(r.cellButtons) && r.cellButtons.length > 0 && (o += wt(r.cellButtons));
				let c = Math.ceil(o) + 16 + 28;
				s && (c = Math.max(c, 200)), e[n.id] = Math.min(Math.max(c, 60), 500);
			}
			return e;
		}
		function nt(e) {
			let t = { ...tt() }, n = e;
			if (!(typeof n == "number" && Number.isFinite(n)) || n <= 0) {
				q.value = t;
				return;
			}
			let r = Q.getVisibleLeafColumns().map((e) => e.id);
			if (r.length === 0) {
				q.value = t;
				return;
			}
			let i = r.map((e) => t[e] ?? 60), a = i.reduce((e, t) => e + t, 0), o = Math.max(0, Math.floor(n - 84));
			if (a > 0 && a <= o && r.length > 0) {
				let e = jr(r, i, o);
				r.forEach((n) => {
					t[n] = e[n];
				});
			}
			q.value = t;
		}
		let rt = null;
		function it() {
			rt?.disconnect(), rt = null;
		}
		return _(() => {
			(async () => {
				await m(), await new Promise((e) => {
					requestAnimationFrame(() => e());
				});
				let e = N.value?.getScrollViewportInnerWidth?.() ?? 0;
				if (nt(e), e > 0) return;
				let t = typeof N.value?.getViewportResizeObserveTarget == "function" ? N.value.getViewportResizeObserveTarget() : null;
				t && typeof ResizeObserver < "u" && (it(), rt = new ResizeObserver(() => {
					let e = N.value?.getScrollViewportInnerWidth?.() ?? 0;
					e <= 0 || (nt(e), it());
				}), rt.observe(t));
			})();
		}), v(() => {
			it(), Pr($e);
		}), c({ openDeleteConfirmation: Je }), (r, c) => (y(), o("div", {
			ref_key: "rootElRef",
			ref: M,
			class: h(["data-table-root flex flex-col text-[13px]", t.nestingDepth === 0 ? "flex-1 min-h-0 min-w-0" : ""]),
			"data-st-theme": t.theme,
			style: g(ee.value)
		}, [
			t.showToolbar ? (y(), o(e, { key: 0 }, [Be.value ? (y(), i(xt, {
				key: 0,
				"selected-count": T(ze),
				table: T(Q),
				editable: H.value,
				"selection-actions": t.selectionActions,
				"context-menu-actions": t.contextMenuActions,
				"enable-select-all": t.enableSelectAll,
				"total-filtered-count": Y.value ? pe.value : null,
				"enable-select-all-matching": t.enableSelectAllMatching,
				"count-label-singular": t.countLabelSingular,
				"count-label-plural": t.countLabelPlural,
				onDeleteConfirmRequest: Ye,
				onSelectionAction: c[0] ||= (e, t) => V("selection-action", e, t, ge()),
				onSelectAllMatching: c[1] ||= (e) => V("select-all-matching"),
				onClearFullSelection: Re
			}, null, 8, [
				"selected-count",
				"table",
				"editable",
				"selection-actions",
				"context-menu-actions",
				"enable-select-all",
				"total-filtered-count",
				"enable-select-all-matching",
				"count-label-singular",
				"count-label-plural"
			])) : (y(), i(ft, {
				key: 1,
				table: T(Q),
				sorting: W.value,
				"column-filters": G.value,
				"column-visibility": J.value,
				"default-column-visibility": t.defaultColumnVisibility,
				editable: H.value,
				loading: t.loading,
				"is-empty": Te.value.length === 0,
				"default-insert-label": t.defaultInsertLabel,
				"insert-actions": t.insertActions,
				"toolbar-actions": t.toolbarActions,
				"toolbar-actions-label": t.toolbarActionsLabel,
				"sub-table-columns": t.subTableColumns,
				"sub-table-sorting": ae.value,
				"sub-table-column-filters": oe.value,
				"sub-table-column-visibility": se.value,
				"table-name": t.tableName,
				"onUpdate:sorting": c[2] ||= (e) => W.value = e,
				"onUpdate:columnFilters": c[3] ||= (e) => G.value = e,
				"onUpdate:columnVisibility": c[4] ||= (e) => J.value = e,
				"onUpdate:subTableSorting": c[5] ||= (e) => ae.value = e,
				"onUpdate:subTableColumnFilters": c[6] ||= (e) => oe.value = e,
				"onUpdate:subTableColumnVisibility": c[7] ||= (e) => se.value = e,
				onInsertRow: Ue,
				onInsertAction: c[8] ||= (e) => V("insert-action", e),
				onRefresh: c[9] ||= (e) => V("refresh"),
				onToolbarAction: c[10] ||= (e) => V("toolbar-action", e)
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
				"insert-actions",
				"toolbar-actions",
				"toolbar-actions-label",
				"sub-table-columns",
				"sub-table-sorting",
				"sub-table-column-filters",
				"sub-table-column-visibility",
				"table-name"
			]))], 64)) : a("", !0),
			t.error && !U.value ? (y(), o("div", Ir, [
				c[19] ||= s("svg", {
					class: "w-3.5 h-3.5 shrink-0",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" })], -1),
				s("span", Lr, C(t.error), 1),
				s("button", {
					class: "opacity-60 hover:opacity-100",
					onClick: c[11] ||= (e) => U.value = !0
				}, [...c[18] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])
			])) : a("", !0),
			s("div", Rr, [s("div", zr, [u(En, {
				ref_key: "tableGridRef",
				ref: N,
				table: T(Q),
				onUpdateCell: Ze,
				onContextMenu: Qe,
				onEditRow: We
			}, null, 8, ["table"]), t.showPagination ? (y(), i(Hn, {
				key: 0,
				table: T(Q),
				"total-count": t.totalCount,
				"has-random-access": t.hasRandomAccess,
				"staged-edits": t.stagedEdits,
				"pending-edit-count": we.value,
				committing: ye.value || t.loading,
				"count-label-singular": t.countLabelSingular,
				"count-label-plural": t.countLabelPlural,
				onCommit: Fe,
				onDiscard: Ie
			}, null, 8, [
				"table",
				"total-count",
				"has-random-access",
				"staged-edits",
				"pending-edit-count",
				"committing",
				"count-label-singular",
				"count-label-plural"
			])) : a("", !0)]), u(n, { name: "slide-panel" }, {
				default: j(() => [(H.value.insert || H.value.update) && Ve.value.open ? (y(), i(hr, {
					key: 0,
					mode: Ve.value.mode,
					"row-data": Ve.value.rowData,
					table: T(Q),
					"table-name": t.tableName,
					onSave: Ke,
					onClose: Ge
				}, null, 8, [
					"mode",
					"row-data",
					"table",
					"table-name"
				])) : a("", !0)]),
				_: 1
			})]),
			u(Or, {
				modelValue: z.value,
				"onUpdate:modelValue": c[12] ||= (e) => z.value = e,
				"row-count": B.value.length,
				onConfirm: Xe
			}, null, 8, ["modelValue", "row-count"]),
			$.value.show ? (y(), i(wr, {
				key: 2,
				x: $.value.x,
				y: $.value.y,
				row: $.value.row,
				cell: $.value.cell,
				"custom-actions": t.contextMenuActions,
				"allow-row-edit": te.value,
				"allow-row-delete": ne.value,
				onClose: $e,
				onEditRow: c[13] ||= (e) => We($.value.row.original),
				onDeleteRow: c[14] ||= (e) => Je([$.value.row.id]),
				onFilterByValue: et,
				onUndoRow: c[15] ||= (e) => ke($.value.row.id),
				onUndoCell: c[16] ||= (e) => Ae($.value.row.id, e),
				onRowAction: c[17] ||= (e, t) => V("row-action", e, t)
			}, null, 8, [
				"x",
				"y",
				"row",
				"cell",
				"custom-actions",
				"allow-row-edit",
				"allow-row-delete"
			])) : a("", !0)
		], 14, Fr));
	}
}, [["__scopeId", "data-v-d70cda5b"]]);
//#endregion
export { Vr as DataTable };
