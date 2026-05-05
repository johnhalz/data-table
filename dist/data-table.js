import { Fragment as e, Teleport as t, Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createStaticVNode as c, createTextVNode as l, createVNode as u, inject as d, isRef as f, mergeProps as p, nextTick as m, normalizeClass as h, normalizeStyle as g, onMounted as _, onUnmounted as v, openBlock as y, provide as b, ref as x, renderList as S, shallowRef as C, toDisplayString as w, toValue as T, unref as E, useTemplateRef as D, vModelSelect as O, vModelText as k, watch as A, watchEffect as j, withCtx as M, withDirectives as N, withModifiers as P } from "vue";
import { FlexRender as F, getCoreRowModel as I, getFilteredRowModel as L, getPaginationRowModel as R, getSortedRowModel as z, useVueTable as B } from "@tanstack/vue-table";
import { onClickOutside as V } from "@vueuse/core";
import { useVirtualizer as ee } from "@tanstack/vue-virtual";
//#region \0plugin-vue:export-helper
var H = (e, t) => {
	let n = e.__vccOpts || e;
	for (let [e, r] of t) n[e] = r;
	return n;
}, U = { class: "p-3" }, W = {
	key: 0,
	class: "text-center py-4",
	style: { color: "var(--st-text-tertiary)" }
}, G = {
	key: 1,
	class: "text-xs font-medium uppercase tracking-wide mb-2",
	style: { color: "var(--st-text-placeholder)" }
}, K = ["onDragstart", "onDragover"], q = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, te = ["onUpdate:modelValue"], J = ["value"], Y = ["onClick", "title"], ne = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, re = {
	key: 0,
	"fill-rule": "evenodd",
	d: "M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
}, ie = {
	key: 1,
	"fill-rule": "evenodd",
	d: "M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
}, ae = ["onClick"], oe = ["onDragstart", "onDragover"], se = {
	class: "text-xs w-12 shrink-0",
	style: { color: "var(--st-text-tertiary)" }
}, ce = ["onUpdate:modelValue"], le = ["value"], X = ["onClick", "title"], ue = {
	class: "w-3 h-3",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, de = {
	key: 0,
	"fill-rule": "evenodd",
	d: "M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"
}, fe = {
	key: 1,
	"fill-rule": "evenodd",
	d: "M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"
}, pe = ["onClick"], me = {
	class: "px-3 py-2 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, he = /* @__PURE__ */ H({
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
		A([() => i.sorting, () => i.subTableSorting], () => {
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
		function T() {
			h.value = [], u("update:sorting", []), p.value && u("update:sub-table-sorting", []), u("close");
		}
		let D = r(() => h.value.filter((e) => e.table === "parent")), k = r(() => h.value.filter((e) => e.table === "sub"));
		function j(e, t) {
			let n = 0;
			for (let r = 0; r < h.value.length; r++) if (h.value[r].table === e) {
				if (n === t) return r;
				n++;
			}
			return -1;
		}
		let M = x(null), F = x(null);
		function I(e) {
			M.value = e;
		}
		function L(e, t) {
			e.preventDefault(), F.value = t;
		}
		function R() {
			if (M.value !== null && F.value !== null && M.value !== F.value) {
				let e = [...h.value], [t] = e.splice(M.value, 1);
				e.splice(F.value, 0, t), h.value = e;
			}
			M.value = null, F.value = null;
		}
		return (n, r) => (y(), o("div", {
			class: "absolute top-full right-0 mt-1 w-96 rounded shadow-xl z-50 text-[13px]",
			style: {
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			},
			onClick: r[2] ||= P(() => {}, ["stop"])
		}, [s("div", U, [
			h.value.length === 0 ? (y(), o("div", W, [...r[3] ||= [s("p", { class: "mb-1" }, "No sorts applied to this view", -1), s("p", { class: "text-xs" }, "Add a column below to sort the view", -1)]])) : a("", !0),
			p.value ? (y(), o("div", G, w(t.tableName), 1)) : a("", !0),
			(y(!0), o(e, null, S(D.value, (n, i) => (y(), o("div", {
				key: "p-" + i,
				class: "flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors",
				style: g(F.value === j("parent", i) && M.value !== j("parent", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
				draggable: "true",
				onDragstart: (e) => I(j("parent", i)),
				onDragover: (e) => L(e, j("parent", i)),
				onDragend: R
			}, [
				r[5] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\" data-v-f1143526><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\" data-v-f1143526><circle cx=\"5.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle></svg></span>", 1),
				s("span", q, w(i === 0 ? "sort by" : "then by"), 1),
				N(s("select", {
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
				}, [l(w(t.id), 1), E(f) ? (y(), o(e, { key: 0 }, [l(" (" + w(t.type) + ")", 1)], 64)) : a("", !0)], 8, J))), 128))], 8, te), [[O, n.id]]),
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
				}, [(y(), o("svg", ne, [n.desc ? (y(), o("path", ie)) : (y(), o("path", re))])), l(" " + w(n.desc ? "DESC" : "ASC"), 1)], 12, Y),
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
			], 44, K))), 128)),
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
				(y(!0), o(e, null, S(k.value, (n, i) => (y(), o("div", {
					key: "s-" + i,
					class: "flex items-center gap-2 mb-2 rounded px-1 -mx-1 transition-colors",
					style: g(F.value === j("sub", i) && M.value !== j("sub", i) ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					draggable: "true",
					onDragstart: (e) => I(j("sub", i)),
					onDragover: (e) => L(e, j("sub", i)),
					onDragend: R
				}, [
					r[7] ||= c("<span class=\"cursor-grab active:cursor-grabbing shrink-0 flex items-center\" style=\"color:var(--st-text-placeholder);\" data-v-f1143526><svg class=\"w-3.5 h-3.5\" viewBox=\"0 0 16 16\" fill=\"currentColor\" data-v-f1143526><circle cx=\"5.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"4\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"8\" r=\"1\" data-v-f1143526></circle><circle cx=\"5.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle><circle cx=\"10.5\" cy=\"12\" r=\"1\" data-v-f1143526></circle></svg></span>", 1),
					s("span", se, w(i === 0 ? "sort by" : "then by"), 1),
					N(s("select", {
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
					}, [l(w(t.id), 1), E(f) ? (y(), o(e, { key: 0 }, [l(" (" + w(t.type) + ")", 1)], 64)) : a("", !0)], 8, le))), 128))], 8, ce), [[O, n.id]]),
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
					}, [(y(), o("svg", ue, [n.desc ? (y(), o("path", fe)) : (y(), o("path", de))])), l(" " + w(n.desc ? "DESC" : "ASC"), 1)], 12, X),
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
			onClick: T
		}, " Clear sorting ")) : a("", !0), s("button", {
			class: "px-3 py-1 rounded text-[13px] font-medium transition-colors",
			style: {
				backgroundColor: "var(--st-accent)",
				color: "var(--st-text-on-accent)"
			},
			onClick: C
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
], Z = {
	INSERT: "insert",
	UPDATE: "update",
	DELETE: "delete"
}, ve = "__pending_", ye = { class: "relative flex items-center" }, be = {
	key: 0,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, xe = {
	key: 1,
	class: "w-3.5 h-3.5",
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, Se = {
	class: "rounded-lg shadow-xl p-3",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Ce = ["type", "value"], we = {
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
		function T() {
			w();
		}
		return (e, n) => (y(), o("div", ye, [s("button", {
			ref_key: "triggerRef",
			ref: h,
			class: "flex items-center justify-center w-4 h-4 rounded transition-colors shrink-0",
			style: g({ color: p.value ? "var(--st-accent)" : "var(--st-text-placeholder)" }),
			title: "Pick date/time",
			onClick: P(C, ["stop"])
		}, [_.value === "time" ? (y(), o("svg", be, [...n[1] ||= [s("path", { d: "M8 0a8 8 0 100 16A8 8 0 008 0zM1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zm7-3.25a.75.75 0 00-1.5 0v3.5c0 .27.144.518.378.651l2.5 1.5a.75.75 0 10.744-1.302L8.5 7.742V4.75z" }, null, -1)]])) : (y(), o("svg", xe, [...n[2] ||= [s("path", { d: "M4.75 0a.75.75 0 01.75.75V2h5V.75a.75.75 0 011.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0113.25 16H2.75A1.75 1.75 0 011 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 014.75 0zm0 3.5h-2a.25.25 0 00-.25.25V6h10.5V3.75a.25.25 0 00-.25-.25h-2V5a.75.75 0 01-1.5 0V3.5h-5V5a.75.75 0 01-1.5 0V3.5zM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V7.5H2.5z" }, null, -1)]]))], 4), (y(), i(t, { to: "body" }, [p.value ? (y(), o("div", {
			key: 0,
			class: "fixed inset-0 z-40",
			onClick: T
		})) : a("", !0), p.value ? (y(), o("div", {
			key: 1,
			ref_key: "pickerRef",
			ref: m,
			class: "fixed z-50",
			style: g({
				...E(u),
				top: h.value ? h.value.getBoundingClientRect().bottom + 6 + "px" : "0",
				left: h.value ? h.value.getBoundingClientRect().left + "px" : "0"
			}),
			onClick: n[0] ||= P(() => {}, ["stop"])
		}, [s("div", Se, [s("input", {
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
		}, null, 44, Ce)])], 4)) : a("", !0)]))]));
	}
}, Te = { class: "flex items-center gap-1.5 flex-wrap flex-1 min-w-0" }, Ee = {
	key: 0,
	class: "text-[10px] font-medium uppercase px-1 rounded",
	style: {
		color: "var(--st-text-placeholder)",
		backgroundColor: "var(--st-bg-input)"
	}
}, De = { style: { color: "var(--st-text-secondary)" } }, Oe = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Q = ["value", "onInput"], ke = ["onClick"], Ae = {
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
}, Le = {
	key: 0,
	class: "px-3 py-1 text-xs font-medium uppercase tracking-wide",
	style: { color: "var(--st-text-placeholder)" }
}, $ = [
	"data-highlighted",
	"onClick",
	"onMouseenter"
], Re = { style: { color: "var(--st-text)" } }, ze = {
	class: "font-mono text-xs",
	style: { color: "var(--st-text-placeholder)" }
}, Be = /* @__PURE__ */ H({
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
		}), _ = r(() => h.value.some((e) => e.table === "sub")), v = x("closed"), b = x(null), C = x(""), T = x(0), D = x(null), O = x(null), M = x(null), P = x({
			top: 0,
			left: 0
		}), F = x({});
		function I() {
			if (v.value === "operators" && M.value) {
				let e = M.value.getBoundingClientRect();
				P.value = {
					top: e.bottom + 4,
					left: e.right
				};
				return;
			}
			let e = O.value;
			if (!e) return;
			let t = e.getBoundingClientRect();
			P.value = {
				top: t.bottom + 4,
				left: t.left
			};
		}
		let L = r(() => {
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
		}), R = r(() => L.value.filter((e) => e.type === "operator")), z = r(() => {
			let e = C.value.toLowerCase();
			return e ? l.allColumns.filter((t) => t.id.toLowerCase().includes(e)) : l.allColumns;
		}), B = r(() => z.value.map((e) => ({
			...e,
			table: "parent"
		}))), V = r(() => `Filter by ${l.allColumns.map((e) => e.id).slice(0, 3).join(", ")}...`), ee = r(() => {
			let e = l.subTableColumns || [];
			return [...l.allColumns, ...e];
		});
		function H(e) {
			return ee.value.find((t) => t.id === e)?.type || "varchar";
		}
		function U(e) {
			return ge.includes(H(e));
		}
		function W(e) {
			return e.value?.operator || "=";
		}
		function G(e) {
			return e.value?.value ?? "";
		}
		function K() {
			v.value = "columns", T.value = 0;
		}
		function q(e, t) {
			b.value = {
				id: e,
				table: t
			}, C.value = "", v.value = "operators", T.value = 0;
		}
		function te(e) {
			if (!b.value) return;
			let { id: t, table: n } = b.value, r = {
				id: t,
				value: {
					operator: e,
					value: ""
				}
			};
			n === "sub" ? u("update:sub-table-column-filters", [...l.subTableColumnFilters, r]) : u("update:column-filters", [...l.columnFilters, r]), v.value = "closed", b.value = null, C.value = "", D.value?.blur();
			let i = () => {
				let e = h.value.length - 1, t = F.value[e];
				t ? t.focus() : m(i);
			};
			m(() => m(i));
		}
		function J(e) {
			let t = h.value[e];
			t.table === "sub" ? u("update:sub-table-column-filters", l.subTableColumnFilters.filter((e, n) => n !== t.sourceIndex)) : u("update:column-filters", l.columnFilters.filter((e, n) => n !== t.sourceIndex));
		}
		function Y(e, t) {
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
		function ne(e) {
			v.value === "columns" ? re(e) : v.value === "operators" ? ie(e) : e.key !== "Escape" && K(), e.key === "Escape" && (oe(), D.value?.blur());
		}
		function re(e) {
			let t = B.value;
			if (t.length !== 0) {
				if (e.key === "ArrowDown") e.preventDefault(), T.value = Math.min(T.value + 1, t.length - 1), ae("column-picker");
				else if (e.key === "ArrowUp") e.preventDefault(), T.value = Math.max(T.value - 1, 0), ae("column-picker");
				else if (e.key === "Enter" || e.key === "Tab") {
					e.preventDefault();
					let n = t[T.value];
					n && q(n.id, n.table);
				}
			}
		}
		function ie(e) {
			let t = R.value;
			t.length !== 0 && (e.key === "ArrowDown" ? (e.preventDefault(), T.value = Math.min(T.value + 1, t.length - 1), ae("operator-picker")) : e.key === "ArrowUp" ? (e.preventDefault(), T.value = Math.max(T.value - 1, 0), ae("operator-picker")) : (e.key === "Enter" || e.key === "Tab") && (e.preventDefault(), t[T.value] && te(t[T.value].value)));
		}
		function ae(e) {
			m(() => {
				let t = document.getElementById(e)?.querySelector("[data-highlighted=\"true\"]");
				t && t.scrollIntoView({ block: "nearest" });
			});
		}
		function oe() {
			v.value = "closed", b.value = null, C.value = "", T.value = 0;
		}
		function se() {
			v.value === "closed" && K();
		}
		return A(C, () => {
			T.value = 0;
		}), j((e) => {
			if (v.value === "closed") return;
			function t() {
				m(I);
			}
			I(), window.addEventListener("resize", t), window.addEventListener("scroll", t, !0), e(() => {
				window.removeEventListener("resize", t), window.removeEventListener("scroll", t, !0);
			});
		}), (r, c) => (y(), o("div", Te, [
			(y(!0), o(e, null, S(h.value, (e, t) => (y(), o("div", {
				key: e.table + "-" + e.sourceIndex,
				class: "flex items-center gap-1 rounded px-2 py-0.5 text-[13px]",
				style: {
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)"
				}
			}, [
				_.value ? (y(), o("span", Ee, w(e.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0),
				s("span", De, w(e.id), 1),
				s("span", Oe, w(W(e)), 1),
				s("input", {
					ref_for: !0,
					ref: (e) => {
						e && (F.value[t] = e);
					},
					value: G(e),
					class: "bg-transparent outline-none text-[13px]",
					style: g({
						color: "var(--st-text)",
						width: Math.max(6, (G(e) || "").length + 1) + "ch"
					}),
					placeholder: "value",
					onInput: (e) => Y(t, e.target.value)
				}, null, 44, Q),
				U(e.id) ? (y(), i(we, {
					key: 1,
					value: G(e),
					"column-type": H(e.id),
					onUpdate: (e) => Y(t, e)
				}, null, 8, [
					"value",
					"column-type",
					"onUpdate"
				])) : a("", !0),
				s("button", {
					class: "ml-0.5 w-5 h-5 flex items-center justify-center rounded transition-colors filter-chip-close shrink-0",
					style: { color: "var(--st-text-placeholder)" },
					onClick: (e) => J(t)
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
			}, [_.value || b.value && b.value.table === "sub" ? (y(), o("span", Ae, w(b.value.table === "sub" ? "sub" : n.tableName), 1)) : a("", !0), s("span", je, w(b.value.id), 1)], 512)) : a("", !0),
			s("div", {
				ref_key: "anchorRef",
				ref: O,
				class: "relative flex-1 min-w-[200px]"
			}, [
				N(s("input", {
					ref_key: "searchInputRef",
					ref: D,
					"onUpdate:modelValue": c[0] ||= (e) => C.value = e,
					class: "w-full bg-transparent outline-none text-[13px] py-1",
					style: g({
						color: "var(--st-text)",
						caretColor: v.value === "operators" ? "transparent" : void 0
					}),
					placeholder: v.value === "operators" ? "Pick a filter method..." : h.value.length > 0 ? "+ Add more filters..." : V.value,
					onFocus: se,
					onKeydown: ne
				}, null, 44, Me), [[k, C.value]]),
				(y(), i(t, { to: "body" }, [v.value === "columns" ? (y(), o("div", {
					key: 0,
					id: "column-picker",
					class: "fixed w-60 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
					style: g({
						...E(p),
						top: P.value.top + "px",
						left: P.value.left + "px",
						fontFamily: "var(--dt-font-family)",
						backgroundColor: "var(--st-bg-surface)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					})
				}, [(y(!0), o(e, null, S(z.value, (e, t) => (y(), o("div", {
					key: "p-" + e.id,
					class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
					"data-highlighted": t === T.value,
					style: g(t === T.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					onClick: (t) => q(e.id, "parent"),
					onMouseenter: (e) => T.value = t
				}, [s("span", Pe, w(e.id), 1), E(f) ? (y(), o("span", Fe, w(e.type), 1)) : a("", !0)], 44, Ne))), 128)), z.value.length === 0 ? (y(), o("div", Ie, " No columns found ")) : a("", !0)], 4)) : a("", !0)])),
				(y(), i(t, { to: "body" }, [v.value === "operators" ? (y(), o("div", {
					key: 0,
					id: "operator-picker",
					class: "fixed w-52 rounded shadow-xl z-50 py-1 max-h-60 overflow-auto",
					style: g({
						...E(p),
						top: P.value.top + "px",
						left: P.value.left + "px",
						fontFamily: "var(--dt-font-family)",
						backgroundColor: "var(--st-bg-surface)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					})
				}, [(y(!0), o(e, null, S(L.value, (t, n) => (y(), o(e, { key: n }, [t.type === "header" ? (y(), o("div", Le, w(t.label), 1)) : (y(), o("div", {
					key: 1,
					class: "flex items-center justify-between px-3 py-1.5 cursor-pointer text-[13px]",
					"data-highlighted": R.value.indexOf(t) === T.value,
					style: g(R.value.indexOf(t) === T.value ? { backgroundColor: "var(--st-bg-menu-hover)" } : {}),
					onClick: (e) => te(t.value),
					onMouseenter: (e) => T.value = R.value.indexOf(t)
				}, [s("span", Re, w(t.label), 1), s("span", ze, w(t.value), 1)], 44, $))], 64))), 128))], 4)) : a("", !0)])),
				(y(), i(t, { to: "body" }, [v.value === "closed" ? a("", !0) : (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: oe
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
}, Ze = /* @__PURE__ */ H({
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
		function T() {
			c("update:column-visibility", { ...i.defaultColumnVisibility }), u.value && c("update:sub-table-column-visibility", {});
		}
		return (n, r) => (y(), o("div", {
			class: "absolute top-full right-0 mt-1 w-64 rounded shadow-xl z-50 text-[13px]",
			style: {
				backgroundColor: "var(--st-bg-surface)",
				border: "1px solid var(--st-border-secondary)"
			},
			onClick: r[0] ||= P(() => {}, ["stop"])
		}, [s("div", Ve, [s("span", He, w(_.value) + " of " + w(v.value) + " columns", 1), s("div", { class: "flex items-center gap-2" }, [
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: C
			}, "Show all"),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "text-xs",
				style: { color: "var(--st-text-secondary)" },
				onClick: T
			}, "Default")
		])]), s("div", Ue, [
			u.value ? (y(), o("div", We, w(t.tableName), 1)) : a("", !0),
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
				}, w(e.id), 5),
				E(l) ? (y(), o("span", qe, w(e.type), 1)) : a("", !0)
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
					}, w(e.id), 5),
					E(l) ? (y(), o("span", Xe, w(e.type), 1)) : a("", !0)
				], 8, Je))), 128))
			], 64)) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-c662bbfe"]]), Qe = { style: {
	borderBottom: "1px solid var(--st-border)",
	backgroundColor: "var(--st-bg)"
} }, $e = { class: "flex items-center gap-2 px-3 py-2" }, et = ["disabled"], tt = ["disabled"], nt = ["disabled"], rt = {
	key: 0,
	class: "absolute top-full left-0 mt-1 min-w-[12rem] rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, it = {
	key: 0,
	class: "my-1",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, at = ["disabled", "onClick"], ot = ["innerHTML"], st = { class: "flex-1" }, ct = ["disabled"], lt = {
	key: 0,
	class: "flex items-center"
}, ut = {
	key: 3,
	class: "absolute top-full right-0 mt-1 min-w-[11rem] rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, dt = ["onClick"], ft = ["innerHTML"], pt = /* @__PURE__ */ H({
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
		let c = t, d = n, f = x(!1), p = x(!1), m = x(!1), _ = x(!1), v = x(null), b = x(null), C = x(null), T = x(null);
		V(v, () => {
			f.value = !1;
		}), V(b, () => {
			_.value = !1;
		}), V(C, () => {
			m.value = !1;
		}), V(T, () => {
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
		return (n, r) => (y(), o("div", Qe, [s("div", $e, [
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
			}, [...r[19] ||= [s("path", { d: "M8 3a5 5 0 104.546 2.914.5.5 0 01.908-.418A6 6 0 118 2v1z" }, null, -1), s("path", { d: "M8 4.466V.534a.25.25 0 01.41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 018 4.466z" }, null, -1)]], 2))], 8, et),
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
			}, [r[20] ||= s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M3.5 2.5a.5.5 0 00-1 0v9.793l-1.146-1.147a.5.5 0 00-.708.708l2 2a.5.5 0 00.708 0l2-2a.5.5 0 00-.708-.708L3.5 12.293V2.5zm4 .5a.5.5 0 010-1h1a.5.5 0 010 1h-1zm0 3a.5.5 0 010-1h3a.5.5 0 010 1h-3zm0 3a.5.5 0 010-1h5a.5.5 0 010 1h-5zm0 3a.5.5 0 010-1h7a.5.5 0 010 1h-7z" })], -1), D.value > 0 ? (y(), o(e, { key: 0 }, [l(" Sorted by " + w(D.value) + " rule" + w(D.value > 1 ? "s" : ""), 1)], 64)) : (y(), o(e, { key: 1 }, [l("Sort")], 64))], 12, tt), f.value ? (y(), i(he, {
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
				r[21] ||= s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M8 4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" })], -1),
				l(" " + w(t.toolbarActionsLabel) + " ", 1),
				r[22] ||= s("svg", {
					class: "w-3 h-3 opacity-60",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)
			], 12, nt), _.value ? (y(), o("div", rt, [(y(!0), o(e, null, S(t.toolbarActions, (t, n) => (y(), o(e, { key: t.key ?? `divider-${n}` }, [t.divider ? (y(), o("div", it)) : (y(), o("button", {
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
			}, null, 8, ot)) : a("", !0), s("span", st, w(t.label), 1)], 12, at))], 64))), 128))])) : a("", !0)], 512)) : a("", !0),
			s("div", {
				ref_key: "columnsContainerRef",
				ref: C,
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
			}, [r[23] ||= s("svg", {
				class: "w-3.5 h-3.5",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M1.5 2A1.5 1.5 0 000 3.5v9A1.5 1.5 0 001.5 14h13a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0014.5 2h-13zM1 3.5a.5.5 0 01.5-.5H5v10H1.5a.5.5 0 01-.5-.5v-9zM6 13V3h4v10H6zm5 0V3h3.5a.5.5 0 01.5.5v9a.5.5 0 01-.5.5H11z" })], -1), k.value ? (y(), o(e, { key: 0 }, [l("Columns")], 64)) : (y(), o(e, { key: 1 }, [l(w(O.value) + " hidden", 1)], 64))], 12, ct), m.value ? (y(), i(Ze, {
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
			}, [t.defaultInsertLabel && t.insertActions.length > 0 ? (y(), o("div", lt, [s("button", {
				class: "flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[12] ||= (e) => d("insert-row")
			}, w(t.defaultInsertLabel), 1), s("button", {
				class: "flex items-center self-stretch px-1.5 rounded-r transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)",
					borderLeft: "1px solid var(--st-accent-hover)"
				},
				onClick: r[13] ||= (e) => p.value = !p.value
			}, [...r[24] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])])) : t.defaultInsertLabel ? (y(), o("button", {
				key: 1,
				class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[14] ||= (e) => d("insert-row")
			}, w(t.defaultInsertLabel), 1)) : (y(), o("button", {
				key: 2,
				class: "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium transition-colors",
				style: {
					backgroundColor: "var(--st-accent)",
					color: "var(--st-text-on-accent)"
				},
				onClick: r[15] ||= (e) => p.value = !p.value
			}, [...r[25] ||= [l(" Insert ", -1), s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])), p.value ? (y(), o("div", ut, [t.insertActions.length > 0 ? (y(!0), o(e, { key: 0 }, S(t.insertActions, (e) => (y(), o("button", {
				key: e.key,
				class: "w-full text-left px-3 py-1.5 hover-menu-item flex items-center gap-2",
				style: { color: "var(--st-text)" },
				onClick: (t) => {
					d("insert-action", e.key), p.value = !1;
				}
			}, [e.icon ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 shrink-0 flex items-center justify-center",
				innerHTML: e.icon
			}, null, 8, ft)) : a("", !0), l(" " + w(e.label), 1)], 8, dt))), 128)) : (y(), o(e, { key: 1 }, [
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[16] ||= (e) => {
						d("insert-row"), p.value = !1;
					}
				}, " Insert row "),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[17] ||= (e) => p.value = !1
				}, " Insert column "),
				r[26] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				s("button", {
					class: "w-full text-left px-3 py-1.5 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: r[18] ||= (e) => p.value = !1
				}, " Import data from CSV ")
			], 64))])) : a("", !0)], 512)) : a("", !0)
		])]));
	}
}, [["__scopeId", "data-v-ef7b78d6"]]), mt = {
	class: "px-3 py-2 flex items-center gap-2",
	style: {
		borderBottom: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)"
	}
}, ht = {
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, gt = { class: "relative" }, _t = {
	key: 0,
	class: "absolute top-full left-0 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, vt = ["onClick"], yt = { class: "px-5 pt-5 pb-4" }, bt = { style: { color: "var(--st-text-secondary)" } }, xt = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border-secondary)" }
}, St = /* @__PURE__ */ H({
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
	emits: ["delete-rows", "selection-action"],
	setup(n, { emit: c }) {
		let u = d("themeVars", {}), f = n, p = r(() => f.table.getFilteredRowModel().rows.length), m = r(() => f.selectedCount >= p.value), h = c, _ = x(!1), v = x(!1);
		function b() {
			return Object.keys(f.table.getState().rowSelection);
		}
		function C() {
			return f.table.getSelectedRowModel().rows.map((e) => e.original);
		}
		function T() {
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
		return (r, c) => (y(), o("div", mt, [
			s("span", ht, w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : "") + " selected", 1),
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
			s("div", gt, [
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
				_.value ? (y(), o("div", _t, [
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
					}, w(e.label), 9, vt))), 128))], 64)) : a("", !0)
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
			}, " Select all " + w(p.value) + " " + w(p.value === 1 ? n.countLabelSingular : n.countLabelPlural), 1)) : a("", !0),
			c[18] ||= s("div", { class: "flex-1" }, null, -1),
			(y(), i(t, { to: "body" }, [v.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-50 flex items-center justify-center",
				style: g({ ...E(u) })
			}, [s("div", {
				class: "fixed inset-0",
				style: { backgroundColor: "var(--st-bg-overlay)" },
				onClick: c[11] ||= (e) => v.value = !1
			}), s("div", {
				class: "relative rounded-lg shadow-2xl w-96 text-[13px]",
				style: g({
					...E(u),
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)"
				})
			}, [s("div", yt, [c[17] ||= s("h3", {
				class: "font-medium text-sm mb-2",
				style: { color: "var(--st-text)" }
			}, "Confirm deletion", -1), s("p", bt, " Are you sure you want to delete " + w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : "") + "? This action cannot be undone. ", 1)]), s("div", xt, [s("button", {
				class: "px-3 py-1.5 rounded text-[13px] transition-colors",
				style: {
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				onClick: c[12] ||= (e) => v.value = !1
			}, " Cancel "), s("button", {
				class: "px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 transition-colors font-medium",
				onClick: T
			}, " Delete " + w(n.selectedCount) + " row" + w(n.selectedCount > 1 ? "s" : ""), 1)])], 4)], 4)) : a("", !0)]))
		]));
	}
}, [["__scopeId", "data-v-e29b3b74"]]), Ct = { class: "flex items-center gap-1.5 px-2 py-1.5 cursor-default overflow-hidden" }, wt = {
	class: "shrink-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Tt = {
	key: 0,
	class: "text-xs font-normal truncate min-w-0",
	style: { color: "var(--st-text-tertiary)" }
}, Et = {
	key: 1,
	class: "text-xs shrink-0",
	style: { color: "var(--st-accent)" }
}, Dt = {
	key: 2,
	class: "shrink-0 text-xs",
	style: { color: "var(--st-text-tertiary)" },
	title: "Column is frozen"
}, Ot = /* @__PURE__ */ H({
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
		function T() {
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
			Array.isArray(s.cellButtons) && s.cellButtons.length > 0 && (l += s.cellButtons.length * 22);
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
				borderBottom: E(u) ? "1px solid var(--st-border)" : "none",
				borderRight: E(f) ? "1px solid var(--st-border)" : "none"
			})
		}, [
			s("div", Ct, [
				s("span", wt, [e.header.isPlaceholder ? a("", !0) : (y(), i(E(F), {
					key: 0,
					render: e.header.column.columnDef.header,
					props: e.header.getContext()
				}, null, 8, ["render", "props"]))]),
				E(r) ? (y(), o("span", Tt, w(E(b).type), 1)) : a("", !0),
				e.header.column.getIsSorted() ? (y(), o("span", Et, w(e.header.column.getIsSorted() === "asc" ? "↑" : "↓"), 1)) : a("", !0),
				E(b).isFrozen ? (y(), o("span", Dt, "❄")) : a("", !0),
				s("button", {
					ref_key: "triggerRef",
					ref: v,
					class: h(["ml-auto shrink-0 w-4 h-4 flex items-center justify-center opacity-0 group-hover/header:opacity-100 transition-opacity", { "!opacity-100": p.value }]),
					style: { color: "var(--st-text-tertiary)" },
					onClick: P(S, ["stop"])
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
					...E(c),
					fontFamily: "var(--dt-font-family)",
					top: m.value.top + "px",
					left: m.value.left + "px",
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				}),
				onClick: d[0] ||= P(() => {}, ["stop"])
			}, [
				s("button", {
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: T
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
				}, "❄", -1), l(" " + w(E(b).isFrozen ? "Unfreeze column" : "Freeze column"), 1)])
			], 4)) : a("", !0)])),
			s("div", {
				class: h(["absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500/50 active:bg-blue-500", { "bg-blue-500": e.header.column.getIsResizing() }]),
				onMousedown: A,
				onTouchstart: A,
				onDblclick: P(j, ["stop"])
			}, null, 34)
		], 4));
	}
}, [["__scopeId", "data-v-032be2da"]]), kt = ["title"], At = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, jt = {
	key: 1,
	class: "text-[13px]",
	style: { color: "var(--st-text)" }
}, Mt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, Nt = {
	class: "absolute -bottom-7 left-0 flex items-center gap-1 rounded shadow-lg px-2 py-1 z-20 text-xs whitespace-nowrap",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, Pt = {
	key: 2,
	class: "flex items-center gap-2"
}, Ft = {
	class: "flex-1 rounded-full overflow-hidden",
	style: {
		height: "6px",
		backgroundColor: "var(--st-border-secondary)"
	}
}, It = {
	class: "text-xs shrink-0 tabular-nums",
	style: { color: "var(--st-text-secondary)" }
}, Lt = {
	class: "flex-1 min-w-0 text-[13px]",
	style: { color: "var(--st-text)" }
}, Rt = {
	key: 0,
	class: "italic",
	style: { color: "var(--st-text-placeholder)" }
}, zt = {
	key: 2,
	class: "block whitespace-pre-wrap break-words"
}, Bt = ["title"], Vt = ["innerHTML"], Ht = ["title", "onClick"], Ut = ["innerHTML"], Wt = {
	key: 1,
	class: "text-[11px]"
}, Gt = {
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
		let i = t, c = d("editable", !0), u = d("showRowBorders", !0), p = d("showColumnBorders", !0), _ = d("cellButtonVisibility", "hover"), v = d("cellOverflow", "truncate"), b = d("getCellPendingState", () => null), C = d("getCellPreviousValue", () => void 0), T = d("getRowPendingState", () => null), D = r(() => b(i.cell.row.id, i.cell.column.id)), O = r(() => T(i.cell.row.id)), A = r(() => C(i.cell.row.id, i.cell.column.id)), j = r(() => D.value === "modified"), M = r(() => O.value === "delete"), F = r(() => {
			let e = f(_) ? _.value : _;
			return e === "always" ? "opacity-100" : e === "select" ? i.isSelected ? "opacity-100" : "opacity-0" : "opacity-0 group-hover/row:opacity-100";
		}), I = n, L = x(!1), R = x(""), z = x(null), B = i.cell.column.columnDef.meta || {}, V = B.type === "boolean", ee = r(() => {
			if (!B.progressBar) return null;
			let e = i.cell.getValue();
			if (e == null) return null;
			if (typeof B.progressBar == "function") return Math.min(100, Math.max(0, B.progressBar(e, i.cell.row.original)));
			if (typeof B.progressBar == "object" && B.progressBar !== null) {
				let { min: t = 0, max: n = 100 } = B.progressBar;
				return Math.min(100, Math.max(0, (e - t) / (n - t) * 100));
			}
			return Math.min(100, Math.max(0, Number(e)));
		}), H = r(() => B.overflow ? B.overflow : B.multiline ? "wrap" : (f(v) ? v.value : v) || "truncate"), U = B.cellButtons ?? [], W = r(() => {
			if (!B.badge) return null;
			let e = i.cell.getValue();
			if (e == null) return null;
			let t = B.badge;
			if (typeof t == "function" && (t = t(e, i.cell.row.original), !t)) return null;
			let n = typeof t == "object" && t ? t.color : null;
			return n ? {
				backgroundColor: `color-mix(in srgb, ${n} 15%, transparent)`,
				color: n,
				border: `1px solid color-mix(in srgb, ${n} 35%, transparent)`
			} : {
				backgroundColor: "var(--st-border-secondary)",
				color: "var(--st-text)",
				border: "1px solid var(--st-border)"
			};
		}), G = r(() => V && !B.badge), K = r(() => {
			if (!B.suffixIcon) return null;
			let e = i.cell.getValue();
			return typeof B.suffixIcon == "function" ? B.suffixIcon(e, i.cell.row.original) || null : B.suffixIcon;
		});
		function q() {
			L.value || I("select");
		}
		function te() {
			!c.value?.update || G.value || B.progressBar || U.length > 0 || (L.value = !0, I("editing-change", !0), R.value = i.cell.getValue() ?? "", m(() => {
				z.value && (z.value.focus(), z.value.select(), J());
			}));
		}
		function J() {
			z.value && (z.value.style.height = "auto", z.value.style.height = z.value.scrollHeight + "px");
		}
		function Y() {
			I("update", B.type === "int8" || B.type === "int4" || B.type === "float8" ? Number(R.value) : R.value), L.value = !1, I("editing-change", !1);
		}
		function ne() {
			L.value = !1, I("editing-change", !1);
		}
		function re(e) {
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), Y()) : e.key === "Escape" && ne();
		}
		function ie() {
			c.value?.update && I("update", !i.cell.getValue());
		}
		return (n, r) => (y(), o("div", {
			class: "px-2 py-1.5 relative cursor-default align-middle",
			style: g({
				display: "table-cell",
				width: `${t.cell.column.getSize()}px`,
				minWidth: `${t.cell.column.getSize()}px`,
				maxWidth: `${t.cell.column.getSize()}px`,
				overflow: "hidden",
				borderBottom: E(u) ? "1px solid var(--st-border)" : "none",
				borderRight: E(p) ? "1px solid var(--st-border)" : "none",
				boxShadow: t.isSelected && !L.value ? "inset 0 0 0 2px var(--st-accent)" : j.value ? "inset 3px 0 0 var(--st-accent)" : "none",
				zIndex: L.value ? 20 : t.isSelected ? 10 : "auto"
			}),
			title: j.value && A.value !== void 0 ? `Was: ${A.value === null || A.value === "" ? "(empty)" : A.value}` : void 0,
			onClick: q,
			onDblclick: te
		}, [G.value ? (y(), o(e, { key: 0 }, [E(c).update ? (y(), o("button", {
			key: 0,
			class: "flex items-center gap-1.5",
			onClick: P(ie, ["stop"])
		}, [s("span", {
			class: "inline-block w-7 h-4 rounded-full relative transition-colors",
			style: g({ backgroundColor: t.cell.getValue() ? "var(--st-accent)" : "var(--st-toggle-off)" })
		}, [s("span", { class: h(["absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform", t.cell.getValue() ? "left-3.5" : "left-0.5"]) }, null, 2)], 4), s("span", At, w(t.cell.getValue() ? "true" : "false"), 1)])) : (y(), o("span", jt, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Mt, "NULL")) : (y(), o(e, { key: 1 }, [l(w(t.cell.getValue() ? "true" : "false"), 1)], 64))]))], 64)) : L.value ? (y(), o(e, { key: 1 }, [N(s("textarea", {
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
			onKeydown: re,
			onInput: J
		}, null, 544), [[k, R.value]]), s("div", Nt, [
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-accent)" },
				onClick: P(Y, ["stop"])
			}, " ↵ Save "),
			r[1] ||= s("span", { style: { color: "var(--st-text-placeholder)" } }, "|", -1),
			s("button", {
				class: "flex items-center gap-0.5",
				style: { color: "var(--st-text-secondary)" },
				onClick: P(ne, ["stop"])
			}, " Esc Cancel ")
		])], 64)) : ee.value === null ? (y(), o("div", {
			key: 3,
			class: "flex items-center gap-1 min-w-0",
			style: g(M.value ? {
				textDecoration: "line-through",
				opacity: .5
			} : {})
		}, [
			s("div", Lt, [t.cell.getValue() === null || t.cell.getValue() === void 0 ? (y(), o("span", Rt, "NULL")) : W.value ? (y(), o("span", {
				key: 1,
				class: "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium leading-tight",
				style: g(W.value)
			}, w(t.cell.getValue()), 5)) : H.value === "wrap" ? (y(), o("span", zt, w(t.cell.getValue()), 1)) : (y(), o("span", {
				key: 3,
				class: "truncate block",
				title: String(t.cell.getValue())
			}, w(t.cell.getValue()), 9, Bt))]),
			K.value ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 shrink-0 flex items-center justify-center",
				style: g({ color: K.value.color || "var(--st-text-secondary)" }),
				innerHTML: K.value.svg
			}, null, 12, Vt)) : a("", !0),
			E(U).length > 0 ? (y(), o("div", {
				key: 1,
				class: h(["flex items-center gap-0.5 shrink-0", F.value])
			}, [(y(!0), o(e, null, S(E(U), (e) => (y(), o("button", {
				key: e.label,
				class: "flex items-center justify-center w-5 h-5 rounded transition-colors",
				style: { color: "var(--st-text-secondary)" },
				title: e.label,
				onClick: P((n) => e.onClick(t.cell.row.original), ["stop"])
			}, [e.icon ? (y(), o("span", {
				key: 0,
				class: "w-3.5 h-3.5 flex items-center justify-center",
				innerHTML: e.icon
			}, null, 8, Ut)) : (y(), o("span", Wt, w(e.label), 1))], 8, Ht))), 128))], 2)) : a("", !0)
		], 4)) : (y(), o("div", Pt, [s("div", Ft, [s("div", {
			class: "h-full rounded-full transition-all duration-300",
			style: g({
				width: `${ee.value}%`,
				backgroundColor: "var(--st-accent)"
			})
		}, null, 4)]), s("span", It, w(Math.round(ee.value)) + "% ", 1)]))], 44, kt));
	}
}, Kt = ["data-index"], qt = {
	class: "group/row",
	style: {
		display: "table",
		tableLayout: "fixed",
		width: "100%"
	}
}, Jt = { class: "flex items-center justify-end pr-1.5 pl-0.5 h-full" }, Yt = {
	class: "text-xs text-right flex-1",
	style: { color: "var(--st-text-tertiary)" }
}, Xt = ["checked"], Zt = /* @__PURE__ */ H({
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
			let e = E(c);
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
		}), f = d("showRowBorders", !0), m = d("showColumnBorders", !0), _ = d("getSubTable", null), v = d("expanded", {}), b = d("toggleRowExpanded", () => {}), x = d("nestingDepth", 0), C = d("parentTheme", "dark"), D = d("parentAccentColor", "#3ecf8e"), O = d("subTableSorting", {}), k = d("subTableColumnFilters", {}), A = d("subTableColumnVisibility", {}), j = d("getRowPendingState", () => null), M = r(() => {
			let e = m ? "inset -1px 0 0 var(--st-border)" : "", t = "2px 0 4px var(--st-shadow-sticky)";
			return e ? `${e}, ${t}` : t;
		}), N = r(() => _ ? _(n.row.original) : null), F = r(() => E(v) ?? {});
		function I() {
			return !!N.value;
		}
		function L() {
			return !!F.value?.[n.row.id];
		}
		let R = r(() => n.virtualOffsetY == null ? { width: "100%" } : {
			position: "absolute",
			top: "0px",
			left: "0px",
			width: "100%",
			transform: `translateY(${n.virtualOffsetY}px)`,
			zIndex: n.editingRowId === n.row.id ? 5 : "auto"
		});
		return (n, r) => (y(), o("div", {
			class: h(["st-row", {
				"st-row--selected": t.row.getIsSelected(),
				"st-row--pending-insert": E(j)(t.row.id) === "insert",
				"st-row--pending-delete": E(j)(t.row.id) === "delete"
			}]),
			style: g(R.value),
			"data-index": t.virtualOffsetY == null ? void 0 : t.rowIndex
		}, [s("div", qt, [
			s("div", {
				class: "py-1.5 align-middle sticky left-0 z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "44px",
					minWidth: "44px",
					borderBottom: E(f) ? "1px solid var(--st-border)" : "none"
				})
			}, [s("div", Jt, [I() ? (y(), o("button", {
				key: 0,
				class: "flex items-center justify-center w-4 h-4 shrink-0 transition-transform duration-150",
				style: g({
					color: L() ? "var(--st-accent)" : "var(--st-text-secondary)",
					transform: L() ? "rotate(90deg)" : "rotate(0deg)"
				}),
				title: "Toggle sub-table",
				onClick: r[0] ||= P((e) => E(b)(t.row.id), ["stop"])
			}, [...r[4] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6 3l5 5-5 5V3z" })], -1)]], 4)) : l.value.update ? (y(), o("button", {
				key: 1,
				class: "invisible group-hover/row:visible flex items-center justify-center w-4 h-4 shrink-0",
				style: { color: "var(--st-text-secondary)" },
				title: "Expand row",
				onClick: r[1] ||= P((e) => n.$emit("edit-row", t.row.original), ["stop"])
			}, [...r[5] ||= [s("svg", {
				class: "w-3 h-3",
				viewBox: "0 0 16 16",
				fill: "none",
				stroke: "currentColor",
				"stroke-width": "2"
			}, [s("path", { d: "M6 2h8v8M14 2L6 10" })], -1)]])) : a("", !0), s("span", Yt, w(t.orderNumber), 1)])], 4),
			s("div", {
				class: "px-1 py-1.5 text-center align-middle sticky z-10 st-sticky-cell",
				style: g({
					display: "table-cell",
					width: "40px",
					minWidth: "40px",
					left: "44px",
					borderBottom: E(f) ? "1px solid var(--st-border)" : "none",
					boxShadow: M.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: t.row.getIsSelected(),
				onClick: r[2] ||= (e) => n.$emit("toggle-row-select", t.row, e, t.rowIndex)
			}, null, 8, Xt)], 4),
			(y(!0), o(e, null, S(t.row.getVisibleCells(), (e) => (y(), i(Gt, {
				key: e.id,
				cell: e,
				"is-selected": t.selectedCell === `${t.row.id}:${e.column.id}`,
				onSelect: (r) => n.$emit("select-cell", t.row.id, e.column.id),
				onUpdate: (r) => n.$emit("update-cell", t.row.id, e.column.id, r),
				onEditingChange: r[3] ||= (e) => n.$emit("editing-change", e, t.row.id),
				onContextmenu: P((r) => n.$emit("context-menu", r, t.row, e), ["prevent"])
			}, null, 8, [
				"cell",
				"is-selected",
				"onSelect",
				"onUpdate",
				"onContextmenu"
			]))), 128))
		]), L() && N.value ? (y(), o("div", {
			key: 0,
			style: g({
				display: "block",
				width: t.totalTableWidth + "px",
				borderBottom: E(f) ? "1px solid var(--st-border)" : "none"
			})
		}, [s("div", { style: g({
			borderLeft: "3px solid var(--st-accent)",
			marginLeft: 10 + Number(T(E(x)) || 0) * 16 + "px",
			backgroundColor: "var(--st-bg)"
		}) }, [u(Sr, p(N.value, {
			theme: N.value.theme ?? E(E(C)),
			"accent-color": N.value.accentColor ?? E(E(D)),
			"nesting-depth": E(x) + 1,
			"controlled-sorting": E(O),
			"controlled-column-filters": E(k),
			"controlled-column-visibility": E(A)
		}), null, 16, [
			"theme",
			"accent-color",
			"nesting-depth",
			"controlled-sorting",
			"controlled-column-filters",
			"controlled-column-visibility"
		])], 4)], 4)) : a("", !0)], 14, Kt));
	}
}, [["__scopeId", "data-v-aeb6a2ab"]]), Qt = 36, $t = 56, en = 40, tn = 300, nn = {
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
		let a = t, s = n, c = d("cellOverflow", "truncate"), l = d("getSubTable", null), u = d("expanded"), f = typeof window < "u" && "onscrollend" in window, p = r(() => E(u) ?? {}), m = ee(r(() => {
			let e = a.rows, t = p.value, n = E(c) === "wrap", r = {}, i = l;
			if (i) for (let t of e) {
				let e = i(t.original);
				e && (r[t.id] = e);
			}
			return {
				count: e.length,
				getScrollElement: () => E(a.scrollElementRef),
				estimateSize: (i) => {
					let a = e[i];
					if (!a) return Qt;
					let o = n ? $t : Qt;
					return r[a.id] ? t[a.id] ? Math.max(o, tn) : Math.max(o, en) : o;
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
		}) }, [(y(!0), o(e, null, S(h.value, (e) => (y(), i(Zt, {
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
}, rn = {
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
		}, [(y(!0), o(e, null, S(t.rows, (e, n) => (y(), i(Zt, {
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
}, an = ["checked", "indeterminate"], on = {
	key: 0,
	class: "absolute inset-0 flex items-center justify-center pointer-events-none",
	style: { top: "33px" }
}, sn = { class: "flex flex-col items-center gap-4 text-center px-6 pointer-events-auto" }, cn = {
	class: "flex items-center justify-center w-14 h-14 rounded-2xl",
	style: {
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, ln = {
	class: "w-7 h-7",
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "1.5",
	"stroke-linecap": "round",
	"stroke-linejoin": "round",
	style: { color: "var(--st-accent)" }
}, un = { class: "flex flex-col gap-1" }, dn = {
	class: "font-semibold text-[15px]",
	style: { color: "var(--st-text)" }
}, fn = {
	class: "text-[13px] max-w-xs leading-relaxed",
	style: { color: "var(--st-text-tertiary)" }
}, pn = {
	key: 0,
	class: "relative mt-1"
}, mn = {
	key: 0,
	class: "flex items-center"
}, hn = {
	key: 2,
	class: "absolute top-full left-1/2 -translate-x-1/2 mt-1 w-48 rounded shadow-xl z-50 py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, gn = 500, _n = /* @__PURE__ */ H({
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
		let f = n, p = d("editable", !0), m = r(() => {
			let e = E(p);
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
		}), _ = d("showRowBorders", !0), v = d("showColumnBorders", !0), b = d("emptyTitle", "No rows found"), C = d("emptyMessage", "Get started by inserting a new row."), O = d("openInsertPanel", null), k = d("defaultInsertLabel", null), A = d("insertRow", () => {}), j = x(!1), M = d("nestingDepth", 0), N = u, F = x(null), I = x(null), L = r(() => f.table.getHeaderGroups()), R = r(() => 84 + f.table.getVisibleLeafColumns().reduce((e, t) => e + t.getSize(), 0)), z = r(() => f.table.getRowModel().rows), B = r(() => f.table.getState().pagination), V = r(() => f.table.getIsAllPageRowsSelected()), ee = r(() => f.table.getIsSomePageRowsSelected());
		function H(e, t) {
			F.value = `${e}:${t}`;
		}
		function U() {
			F.value = null;
		}
		function W(e, t, n) {
			N("context-menu", e, t, n);
		}
		function G() {
			f.table.toggleAllPageRowsSelected(!V.value);
		}
		let K = x(null);
		function q(e, t, n) {
			if (t?.shiftKey && K.value !== null) {
				let e = Math.min(K.value, n), t = Math.max(K.value, n), r = z.value;
				for (let n = e; n <= t; n++) r[n].toggleSelected(!0);
			} else e.toggleSelected(!e.getIsSelected());
			K.value = n;
		}
		let te = r(() => {
			let e = v ? "inset -1px 0 0 var(--st-border)" : "", t = "2px 0 4px var(--st-shadow-sticky)";
			return e ? `${e}, ${t}` : t;
		}), J = r(() => z.value.length > gn), Y = D("scroller");
		function ne(e, t) {
			I.value = e ? t : null;
		}
		function re() {
			let e = Y.value;
			if (!e) return null;
			let t = T(M);
			return t && t > 0 ? e.parentElement : e;
		}
		function ie() {
			return re()?.clientWidth ?? 0;
		}
		return c({
			getScrollViewportInnerWidth: ie,
			getViewportResizeObserveTarget: re
		}), (r, c) => (y(), o("div", { class: h(E(M) === 0 ? "flex-1 min-h-0 relative" : "overflow-auto") }, [s("div", {
			ref: "scroller",
			class: h(E(M) === 0 ? "absolute inset-0 overflow-auto flex flex-col items-start min-h-0" : "flex flex-col items-start"),
			style: { "scrollbar-gutter": "stable" },
			onClick: P(U, ["self"])
		}, [s("div", {
			class: "sticky top-0 z-[26] shrink-0 isolate",
			style: g({
				width: R.value + "px",
				backgroundColor: "var(--st-bg-header)"
			})
		}, [s("table", {
			class: "border-separate border-spacing-0 table-fixed w-full border-0 bg-transparent",
			style: g({ width: R.value + "px" })
		}, [s("thead", null, [(y(!0), o(e, null, S(L.value, (t) => (y(), o("tr", { key: t.id }, [
			s("th", {
				class: "px-1.5 py-1.5 text-right font-normal sticky left-0 z-[40]",
				style: g({
					width: "44px",
					minWidth: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: E(_) ? "1px solid var(--st-border)" : "none",
					color: "var(--st-text-tertiary)"
				})
			}, [...c[11] ||= [s("span", { class: "text-xs" }, "#", -1)]], 4),
			s("th", {
				class: "px-1 py-1.5 text-center align-middle sticky z-[39]",
				style: g({
					width: "40px",
					minWidth: "40px",
					left: "44px",
					backgroundColor: "var(--st-bg-header)",
					borderBottom: E(_) ? "1px solid var(--st-border)" : "none",
					boxShadow: te.value
				})
			}, [s("input", {
				type: "checkbox",
				class: "cursor-pointer align-middle",
				style: { accentColor: "var(--st-accent)" },
				checked: V.value,
				indeterminate: ee.value,
				title: "Select all rows on this page",
				onChange: G
			}, null, 40, an)], 4),
			(y(!0), o(e, null, S(t.headers, (e) => (y(), i(Ot, {
				key: e.id,
				header: e,
				table: n.table
			}, null, 8, ["header", "table"]))), 128))
		]))), 128))])], 4)], 4), z.value.length > 0 && J.value ? (y(), i(nn, {
			key: 0,
			rows: z.value,
			"scroll-element-ref": Y.value,
			"total-table-width": R.value,
			"selected-cell": F.value,
			"editing-row-id": I.value,
			"pagination-state": B.value,
			onToggleRowSelect: q,
			onEditRow: c[0] ||= (e) => N("edit-row", e),
			onContextMenu: W,
			onSelectCell: H,
			onUpdateCell: c[1] ||= (e, t, n) => N("update-cell", e, t, n),
			onEditingChange: ne
		}, null, 8, [
			"rows",
			"scroll-element-ref",
			"total-table-width",
			"selected-cell",
			"editing-row-id",
			"pagination-state"
		])) : z.value.length > 0 ? (y(), i(rn, {
			key: 1,
			rows: z.value,
			"total-table-width": R.value,
			"selected-cell": F.value,
			"editing-row-id": I.value,
			"pagination-state": B.value,
			onToggleRowSelect: q,
			onEditRow: c[2] ||= (e) => N("edit-row", e),
			onContextMenu: W,
			onSelectCell: H,
			onUpdateCell: c[3] ||= (e, t, n) => N("update-cell", e, t, n),
			onEditingChange: ne
		}, null, 8, [
			"rows",
			"total-table-width",
			"selected-cell",
			"editing-row-id",
			"pagination-state"
		])) : a("", !0)], 2), z.value.length === 0 ? (y(), o("div", on, [s("div", sn, [
			s("div", cn, [(y(), o("svg", ln, [...c[12] ||= [s("rect", {
				x: "3",
				y: "3",
				width: "18",
				height: "18",
				rx: "2"
			}, null, -1), s("path", { d: "M3 9h18M3 15h18M9 9v9M15 9v9" }, null, -1)]]))]),
			s("div", un, [s("p", dn, w(E(b)), 1), s("p", fn, w(E(C)), 1)]),
			m.value.insert ? (y(), o("div", pn, [
				E(k) ? (y(), o("div", mn, [s("button", {
					class: "flex items-center gap-1.5 px-3 py-1 rounded-l text-[13px] font-medium transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					onClick: c[4] ||= (e) => E(A)()
				}, w(E(k)), 1), s("button", {
					class: "flex items-center self-stretch px-1.5 rounded-r transition-colors",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)",
						borderLeft: "1px solid var(--st-accent-hover)"
					},
					onClick: c[5] ||= (e) => j.value = !j.value
				}, [...c[13] ||= [s("svg", {
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
					onClick: c[6] ||= (e) => j.value = !j.value
				}, [...c[14] ||= [l(" Insert ", -1), s("svg", {
					class: "w-3 h-3",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M4.427 6.427l3.396 3.396a.25.25 0 00.354 0l3.396-3.396A.25.25 0 0011.396 6H4.604a.25.25 0 00-.177.427z" })], -1)]])),
				j.value ? (y(), o("div", hn, [
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[7] ||= (e) => {
							E(O)(), j.value = !1;
						}
					}, " Insert row "),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[8] ||= (e) => j.value = !1
					}, " Insert column "),
					c[15] ||= s("div", {
						class: "my-1",
						style: { borderTop: "1px solid var(--st-border-secondary)" }
					}, null, -1),
					s("button", {
						class: "w-full text-left px-3 py-1.5 hover-menu-item",
						style: { color: "var(--st-text)" },
						onClick: c[9] ||= (e) => j.value = !1
					}, " Import data from CSV ")
				])) : a("", !0),
				(y(), i(t, { to: "body" }, [j.value ? (y(), o("div", {
					key: 0,
					class: "fixed inset-0 z-40",
					onClick: c[10] ||= (e) => j.value = !1
				})) : a("", !0)]))
			])) : a("", !0)
		])])) : a("", !0)], 2));
	}
}, [["__scopeId", "data-v-d559b43b"]]), vn = {
	class: "px-3 py-1.5 flex items-center gap-3 text-[13px] shrink-0",
	style: {
		borderTop: "1px solid var(--st-border)",
		backgroundColor: "var(--st-bg)",
		color: "var(--st-text-secondary)"
	}
}, yn = ["disabled"], bn = { class: "flex items-center gap-1.5" }, xn = ["value", "max"], Sn = {
	key: 1,
	class: "tabular-nums",
	style: { color: "var(--st-text)" }
}, Cn = ["disabled"], wn = { class: "flex items-center gap-1.5" }, Tn = ["value"], En = {
	class: "tabular-nums px-2 py-0.5 rounded",
	style: {
		color: "var(--st-accent)",
		backgroundColor: "var(--st-accent-bg)",
		border: "1px solid var(--st-accent-border-light)"
	}
}, Dn = ["disabled"], On = ["disabled"], kn = {
	key: 0,
	class: "w-3 h-3 animate-spin",
	viewBox: "0 0 16 16",
	fill: "none",
	stroke: "currentColor",
	"stroke-width": "2"
}, An = { style: { color: "var(--st-text-tertiary)" } }, jn = {
	class: "text-[13px] mb-4",
	style: { color: "var(--st-text-secondary)" }
}, Mn = { class: "flex items-center justify-end gap-2" }, Nn = {
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
		let u = d("themeVars", {}), f = n, p = c, m = r(() => f.table.getState().pagination.pageIndex), h = r(() => f.table.getState().pagination.pageSize), _ = r(() => f.table.getPageCount()), v = r(() => f.totalCount === null ? f.table.getFilteredRowModel().rows.length : f.totalCount);
		function b(e) {
			let t = Math.max(0, Math.min(e, _.value - 1));
			f.table.setPageIndex(t);
		}
		function S(e) {
			let t = parseInt(e.target.value, 10);
			isNaN(t) || b(t - 1);
		}
		let C = x(!1);
		function T() {
			f.pendingEditCount !== 0 && (C.value = !0);
		}
		function D() {
			p("discard"), C.value = !1;
		}
		return (r, c) => (y(), o("div", vn, [
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !n.table.getCanPreviousPage(),
				onClick: c[0] ||= (e) => n.table.previousPage()
			}, [...c[6] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M9.78 12.78a.75.75 0 01-1.06 0L4.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L6.06 8l3.72 3.72a.75.75 0 010 1.06z" })], -1)]], 8, yn),
			s("div", bn, [
				c[7] ||= s("span", null, "Page", -1),
				n.hasRandomAccess ? (y(), o("input", {
					key: 0,
					type: "number",
					value: m.value + 1,
					min: "1",
					max: _.value,
					class: "w-12 rounded px-1.5 py-0.5 text-center text-[13px] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
					style: {
						backgroundColor: "var(--st-bg-input)",
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text)"
					},
					onChange: S
				}, null, 40, xn)) : (y(), o("span", Sn, w(m.value + 1), 1)),
				s("span", null, "of " + w(_.value), 1)
			]),
			s("button", {
				class: "p-1 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors",
				disabled: !n.table.getCanNextPage(),
				onClick: c[1] ||= (e) => n.table.nextPage()
			}, [...c[8] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M6.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 01-1.06-1.06L9.94 8 6.22 4.28a.75.75 0 010-1.06z" })], -1)]], 8, Cn),
			c[14] ||= s("div", {
				class: "w-px h-4 mx-1",
				style: { backgroundColor: "var(--st-border)" }
			}, null, -1),
			s("div", wn, [c[10] ||= s("span", null, "Rows per page:", -1), s("select", {
				value: h.value,
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
			]], 40, Tn)]),
			c[15] ||= s("div", { class: "flex-1" }, null, -1),
			n.stagedEdits && n.pendingEditCount > 0 ? (y(), o(e, { key: 0 }, [
				s("span", En, w(n.pendingEditCount) + " pending change" + w(n.pendingEditCount === 1 ? "" : "s"), 1),
				s("button", {
					class: "px-2 py-0.5 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)",
						backgroundColor: "transparent"
					},
					disabled: n.committing,
					onClick: T
				}, " Clear edits ", 8, Dn),
				s("button", {
					class: "flex items-center gap-1.5 px-2.5 py-0.5 rounded font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
					style: {
						backgroundColor: "var(--st-accent)",
						color: "var(--st-text-on-accent)"
					},
					disabled: n.committing,
					onClick: c[3] ||= (e) => p("commit")
				}, [n.committing ? (y(), o("svg", kn, [...c[11] ||= [s("path", {
					d: "M8 1.5a6.5 6.5 0 1 1-6.5 6.5",
					"stroke-linecap": "round"
				}, null, -1)]])) : a("", !0), l(" " + w(n.committing ? "Committing…" : "Commit"), 1)], 8, On),
				c[12] ||= s("div", {
					class: "w-px h-4 mx-1",
					style: { backgroundColor: "var(--st-border)" }
				}, null, -1)
			], 64)) : a("", !0),
			s("span", An, w(v.value.toLocaleString()) + " " + w(v.value === 1 ? n.countLabelSingular : n.countLabelPlural), 1),
			(y(), i(t, { to: "body" }, [C.value ? (y(), o("div", {
				key: 0,
				class: "fixed inset-0 z-[100] flex items-center justify-center",
				style: g({
					...E(u),
					backgroundColor: "var(--st-bg-overlay)"
				}),
				onClick: c[5] ||= P((e) => C.value = !1, ["self"])
			}, [s("div", {
				class: "rounded-lg shadow-xl p-5 w-80",
				style: g({
					...E(u),
					backgroundColor: "var(--st-bg-surface)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text)"
				})
			}, [
				c[13] ||= s("h3", { class: "font-semibold text-[14px] mb-2" }, "Clear all pending edits?", -1),
				s("p", jn, " This will discard " + w(n.pendingEditCount) + " pending change" + w(n.pendingEditCount === 1 ? "" : "s") + ". This action cannot be undone. ", 1),
				s("div", Mn, [s("button", {
					class: "px-3 py-1 rounded text-[13px]",
					style: {
						border: "1px solid var(--st-border-secondary)",
						color: "var(--st-text-secondary)"
					},
					onClick: c[4] ||= (e) => C.value = !1
				}, " Cancel "), s("button", {
					class: "px-3 py-1 rounded text-[13px] font-medium",
					style: {
						"background-color": "#ef4444",
						color: "white"
					},
					onClick: D
				}, " Clear edits ")])
			], 4)], 4)) : a("", !0)]))
		]));
	}
}, Pn = {
	class: "px-5 py-4 flex items-center justify-between",
	style: { borderBottom: "1px solid var(--st-border)" }
}, Fn = { class: "flex items-center gap-2" }, In = {
	class: "text-sm",
	style: { color: "var(--st-text)" }
}, Ln = {
	class: "rounded px-2 py-0.5 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-input)",
		border: "1px solid var(--st-border-secondary)",
		color: "var(--st-text-secondary)"
	}
}, Rn = { class: "flex-1 overflow-auto px-5 py-4" }, zn = {
	key: 0,
	class: "mb-6"
}, Bn = { class: "flex items-start gap-4" }, Vn = { class: "w-40 shrink-0 pt-2" }, Hn = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, Un = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, Wn = { class: "flex-1" }, Gn = ["disabled", "onClick"], Kn = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, qn = ["value"], Jn = ["onUpdate:modelValue", "placeholder"], Yn = { key: 1 }, Xn = { class: "flex items-start gap-4" }, Zn = { class: "w-40 shrink-0 pt-2" }, Qn = {
	class: "text-[13px] font-medium",
	style: { color: "var(--st-text)" }
}, $n = {
	class: "text-xs",
	style: { color: "var(--st-text-tertiary)" }
}, er = { class: "flex-1" }, tr = ["disabled", "onClick"], nr = {
	class: "text-xs",
	style: { color: "var(--st-text-secondary)" }
}, rr = ["value"], ir = ["onUpdate:modelValue", "placeholder"], ar = {
	class: "px-5 py-3 flex items-center justify-end gap-2",
	style: { borderTop: "1px solid var(--st-border)" }
}, or = {
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
		function T() {
			let e = {};
			f.value.forEach((t) => {
				l.mode === "update" && l.rowData ? e[t.id] = l.rowData[t.id] ?? "" : t.meta.defaultValue === void 0 ? e[t.id] = t.meta.type === "boolean" ? !1 : "" : e[t.id] = t.meta.defaultValue;
			}), C.value = e;
		}
		T();
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
		function O(e) {
			e.key === "Escape" ? u("close") : (e.metaKey || e.ctrlKey) && e.key === "Enter" && D();
		}
		return _(() => {
			document.addEventListener("keydown", O);
		}), v(() => {
			document.removeEventListener("keydown", O);
		}), (n, r) => (y(), o("div", {
			class: "w-[420px] shrink-0 flex flex-col shadow-2xl overflow-hidden",
			style: g({
				...E(i),
				backgroundColor: "var(--st-bg)",
				borderLeft: "1px solid var(--st-border)"
			})
		}, [
			s("div", Pn, [s("div", Fn, [s("span", In, w(t.mode === "insert" ? "Insert row into" : "Update row from"), 1), s("code", Ln, w(t.tableName), 1)]), s("button", {
				class: "w-6 h-6 flex items-center justify-center",
				style: { color: "var(--st-text-tertiary)" },
				onClick: r[0] ||= (e) => u("close")
			}, [...r[2] ||= [s("svg", {
				class: "w-4 h-4",
				viewBox: "0 0 16 16",
				fill: "currentColor"
			}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])]),
			s("div", Rn, [m.value.length > 0 ? (y(), o("div", zn, [(y(!0), o(e, null, S(m.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", Bn, [s("div", Vn, [s("div", Hn, w(n.id), 1), s("div", Un, w(n.meta.type), 1)]), s("div", Wn, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (C.value[n.id] = !C.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: C.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", C.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", Kn, w(C.value[n.id] ? "true" : "false"), 1)], 10, Gn)) : (y(), o(e, { key: 1 }, [n.meta.isPrimaryKey && t.mode === "update" || n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: C.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, qn)) : N((y(), o("textarea", {
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
			}, null, 8, Jn)), [[k, C.value[n.id]]])], 64))])])]))), 128))])) : a("", !0), b.value.length > 0 ? (y(), o("div", Yn, [r[3] ||= s("div", { class: "mb-3" }, [s("h3", {
				class: "text-sm font-medium",
				style: { color: "var(--st-text)" }
			}, "Optional Fields"), s("p", {
				class: "text-xs mt-0.5",
				style: { color: "var(--st-text-tertiary)" }
			}, "These are columns that do not need any value")], -1), (y(!0), o(e, null, S(b.value, (n) => (y(), o("div", {
				key: n.id,
				class: "mb-4"
			}, [s("div", Xn, [s("div", Zn, [s("div", Qn, w(n.id), 1), s("div", $n, w(n.meta.type), 1)]), s("div", er, [n.meta.type === "boolean" ? (y(), o("button", {
				key: 0,
				class: h(["flex items-center gap-2", { "opacity-50 cursor-not-allowed": n.meta.readOnly && t.mode === "insert" }]),
				disabled: n.meta.readOnly && t.mode === "insert",
				onClick: (e) => !(n.meta.readOnly && t.mode === "insert") && (C.value[n.id] = !C.value[n.id])
			}, [s("span", {
				class: "inline-block w-8 h-[18px] rounded-full relative transition-colors",
				style: g({ backgroundColor: C.value[n.id] ? "var(--st-accent)" : "var(--st-toggle-off)" })
			}, [s("span", { class: h(["absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-transform", C.value[n.id] ? "left-[17px]" : "left-[2px]"]) }, null, 2)], 4), s("span", nr, w(C.value[n.id] ? "true" : "false"), 1)], 10, tr)) : (y(), o(e, { key: 1 }, [n.meta.readOnly && t.mode === "insert" ? (y(), o("input", {
				key: 0,
				value: C.value[n.id],
				class: "w-full rounded px-3 py-2 text-[13px] outline-none cursor-not-allowed",
				style: {
					backgroundColor: "var(--st-bg-input)",
					border: "1px solid var(--st-border-secondary)",
					color: "var(--st-text-secondary)"
				},
				disabled: ""
			}, null, 8, rr)) : N((y(), o("textarea", {
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
			}, null, 8, ir)), [[k, C.value[n.id]]])], 64))])])]))), 128))])) : a("", !0)]),
			s("div", ar, [s("button", {
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
}, sr = {
	class: "w-52 rounded shadow-xl py-1 text-[13px]",
	style: {
		backgroundColor: "var(--st-bg-surface)",
		border: "1px solid var(--st-border-secondary)"
	}
}, cr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
}, lr = {
	class: "w-3.5 h-3.5",
	style: { color: "var(--st-text-secondary)" },
	viewBox: "0 0 16 16",
	fill: "currentColor"
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
}, fr = /* @__PURE__ */ H({
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
		let u = d("editable", !0), f = d("themeVars", {}), p = d("getRowPendingState", () => null), m = d("getCellPendingState", () => null), h = n, b = c, S = r(() => h.row ? p(h.row.id) : null), C = r(() => h.row && h.cell ? m(h.row.id, h.cell.column.id) : null), T = r(() => S.value === "insert" ? "Discard new row" : S.value === "delete" ? "Restore row" : S.value === "update" ? "Undo row changes" : null), D = x(null), O = r(() => h.cell ? h.cell.getValue() : null), k = r(() => h.cell ? h.cell.column.id : null);
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
		V(D, () => {
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
				...E(f),
				...z.value
			})
		}, [s("div", sr, [
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: j
			}, [(y(), o("svg", cr, [...r[0] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), r[1] ||= l(" Copy cell ", -1)]),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: M
			}, [(y(), o("svg", lr, [...r[2] ||= [s("path", { d: "M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25zM5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25z" }, null, -1)]])), r[3] ||= l(" Copy row ", -1)]),
			r[13] ||= s("div", {
				class: "my-1",
				style: { borderTop: "1px solid var(--st-border-secondary)" }
			}, null, -1),
			s("button", {
				class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
				style: { color: "var(--st-text)" },
				onClick: N
			}, [(y(), o("svg", ur, [...r[4] ||= [s("path", { d: "M.75 3a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H.75zM3 7.75A.75.75 0 013.75 7h8.5a.75.75 0 010 1.5h-8.5A.75.75 0 013 7.75zm3 4a.75.75 0 01.75-.75h2.5a.75.75 0 010 1.5h-2.5a.75.75 0 01-.75-.75z" }, null, -1)]])), r[5] ||= l(" Filter by value ", -1)]),
			C.value === "modified" || T.value ? (y(), o(e, { key: 0 }, [
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
				T.value ? (y(), o("button", {
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
				}, [s("path", { d: "M3 7h7a4 4 0 0 1 0 8H6" }), s("path", { d: "M6 4L3 7l3 3" })], -1), l(" " + w(T.value), 1)])) : a("", !0)
			], 64)) : a("", !0),
			E(u).update || E(u).delete ? (y(), o(e, { key: 1 }, [
				r[12] ||= s("div", {
					class: "my-1",
					style: { borderTop: "1px solid var(--st-border-secondary)" }
				}, null, -1),
				E(u).update ? (y(), o("button", {
					key: 0,
					class: "w-full text-left px-3 py-1.5 flex items-center gap-2 hover-menu-item",
					style: { color: "var(--st-text)" },
					onClick: P
				}, [(y(), o("svg", dr, [...r[9] ||= [s("path", { d: "M11.013 1.427a1.75 1.75 0 012.474 0l1.086 1.086a1.75 1.75 0 010 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 01-.927-.928l.929-3.25a1.75 1.75 0 01.445-.758l8.61-8.61z" }, null, -1)]])), r[10] ||= l(" Edit row ", -1)])) : a("", !0),
				E(u).delete && S.value !== "delete" ? (y(), o("button", {
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
}, [["__scopeId", "data-v-8e368a7d"]]), pr = 60;
function mr(e, t) {
	let n = e.length, r = {};
	if (n === 0) return r;
	let i = Math.max(pr * n, Math.floor(t)), a = Math.floor(i / n), o = i - a * n;
	return e.forEach((e, t) => {
		r[e] = a + +(t < o);
	}), r;
}
function hr(e, t, n) {
	let r = e.length;
	if (r === 0) return {};
	let i = Math.max(0, Math.floor(n)), a = t.reduce((e, t) => e + t, 0);
	if (a <= 0) return mr(e, i);
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
//#region src/components/DataTable/DataTable.vue
var gr = ["data-st-theme"], _r = {
	key: 1,
	class: "flex items-center gap-2 px-3 py-2 text-[13px] shrink-0",
	style: {
		backgroundColor: "rgba(239,68,68,0.1)",
		borderBottom: "1px solid rgba(239,68,68,0.3)",
		color: "#ef4444"
	}
}, vr = { class: "flex-1" }, yr = { class: "flex flex-1 min-h-0 min-w-0" }, br = { class: "flex flex-col flex-1 min-w-0 min-h-0" }, xr = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, sans-serif", Sr = /* @__PURE__ */ H({
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
		"insert-action",
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
		function S(e) {
			let t = parseInt(e.replace("#", ""), 16), n = (t >> 16) / 255, r = (t >> 8 & 255) / 255, i = (t & 255) / 255;
			return .2126 * n + .7152 * r + .0722 * i;
		}
		let T = r(() => {
			let e = f.theme === "dark", t = f.accentColor, n = p(t, 20), r = S(t) > .4 ? "#000" : "#fff", i = `color-mix(in srgb, ${t} 10%, transparent)`, a = `color-mix(in srgb, ${t} 40%, transparent)`, o = `color-mix(in srgb, ${t} 30%, transparent)`;
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
		}), D = d(l, null), O = r(() => {
			if (f.fontFamily != null && String(f.fontFamily).trim() !== "") return String(f.fontFamily).trim();
			let e = D == null ? null : E(D);
			return e != null && String(e).trim() !== "" ? String(e).trim() : null;
		});
		b(l, O);
		let k = r(() => ({ "--dt-font-family": O.value || xr })), j = r(() => ({
			...T.value,
			...k.value,
			backgroundColor: "var(--st-bg)",
			color: "var(--st-text)"
		})), N = x(null), P = x(null), F = c, V = r(() => f.editable === !0 ? {
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
		A(() => f.error, () => {
			ee.value = !1;
		});
		let H = C(f.rows);
		A(() => f.rows, (e) => {
			f.stagedEdits || (H.value = e);
		});
		let U = x(f.controlledSorting ?? []), W = x(f.controlledColumnFilters ?? f.columnFilters ?? []), G = x({}), K = x({
			pageIndex: 0,
			pageSize: 100
		}), q = x({}), te = x({
			startOffset: null,
			startSize: null,
			deltaOffset: null,
			deltaPercentage: null,
			isResizingColumn: !1,
			columnSizingStart: []
		}), J = x(f.controlledColumnVisibility ?? { ...f.defaultColumnVisibility });
		A(() => f.controlledSorting, (e) => {
			e !== null && (U.value = e);
		}, { deep: !0 }), A(() => f.controlledColumnFilters, (e) => {
			e !== null && (W.value = e);
		}, { deep: !0 }), A(() => f.columnFilters, (e) => {
			e !== null && (W.value = e);
		}, { deep: !0 }), A(() => f.controlledColumnVisibility, (e) => {
			e !== null && (J.value = e);
		}, { deep: !0 });
		let Y = x([]), ne = x([]), re = x({}), ie = x({}), ae = r(() => f.expandedRows ?? ie.value);
		function oe(e) {
			f.expandedRows === null ? ie.value = {
				...ie.value,
				[e]: !ie.value[e]
			} : F("update:expanded-rows", {
				...f.expandedRows,
				[e]: !f.expandedRows[e]
			});
		}
		function se(e, t, n) {
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
		let ce = r(() => {
			for (let e of f.columns) if (e.meta?.isPrimaryKey) return e.accessorKey ?? e.id ?? "id";
			return "id";
		}), le = r(() => f.totalCount !== null), X = x(/* @__PURE__ */ new Map()), ue = x(!1), de = 0;
		function fe() {
			return de += 1, `${ve}${Date.now()}_${de}`;
		}
		function pe(e) {
			let t = ce.value;
			return f.rows.find((n) => String(n[t] ?? n.id) === String(e));
		}
		let me = r(() => X.value.size > 0), he = r(() => X.value.size), ge = r(() => {
			if (!f.stagedEdits || X.value.size === 0) return f.rows;
			let e = ce.value, t = [], n = f.rows.map((t) => {
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
		function _e(e) {
			let t = fe(), n = new Map(X.value);
			n.set(t, {
				kind: Z.INSERT,
				changes: { ...e }
			}), X.value = n;
		}
		function ye(e, t) {
			let n = String(e), r = new Map(X.value), i = r.get(n);
			if (i?.kind === Z.INSERT) r.set(n, {
				kind: Z.INSERT,
				changes: {
					...i.changes,
					...t
				}
			});
			else if (i?.kind === Z.DELETE) {
				let e = i.snapshot ?? pe(n);
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
				let e = pe(n);
				Object.keys(t).some((n) => t[n] !== e?.[n]) && r.set(n, {
					kind: Z.UPDATE,
					changes: { ...t },
					snapshot: e
				});
			}
			X.value = r;
		}
		function be(e) {
			let t = new Map(X.value);
			for (let n of e) {
				let e = String(n), r = t.get(e);
				if (r?.kind === Z.INSERT) t.delete(e);
				else {
					let n = r?.snapshot ?? pe(e);
					t.set(e, {
						kind: Z.DELETE,
						snapshot: n
					});
				}
			}
			X.value = t;
		}
		function xe(e) {
			let t = new Map(X.value);
			t.delete(String(e)), X.value = t;
		}
		function Se(e, t) {
			let n = String(e), r = X.value.get(n);
			if (!r || r.kind !== Z.UPDATE) return;
			let { [t]: i, ...a } = r.changes, o = new Map(X.value);
			Object.keys(a).length === 0 ? o.delete(n) : o.set(n, {
				...r,
				changes: a
			}), X.value = o;
		}
		function Ce(e) {
			return X.value.get(String(e))?.kind ?? null;
		}
		function we(e, t) {
			let n = X.value.get(String(e));
			return n && n.kind === Z.UPDATE && t in n.changes ? "modified" : null;
		}
		function Te(e, t) {
			let n = X.value.get(String(e));
			if (!(!n || n.kind !== Z.UPDATE)) return n.snapshot?.[t];
		}
		function Ee() {
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
		function De() {
			if (ue.value || !me.value) return;
			let e = Ee();
			ue.value = !0, F("commit-edits", e, (e) => {
				ue.value = !1, e && (X.value = /* @__PURE__ */ new Map());
			});
		}
		function Oe() {
			X.value = /* @__PURE__ */ new Map(), F("discard-edits");
		}
		A(() => [f.stagedEdits, ge.value], ([e, t]) => {
			e ? H.value = t : H.value = f.rows;
		}, { immediate: !0 });
		let Q = B({
			data: H,
			get columns() {
				return f.columns;
			},
			filterFns: { operator: se },
			defaultColumn: { filterFn: "operator" },
			state: {
				get sorting() {
					return U.value;
				},
				get columnFilters() {
					return W.value;
				},
				get rowSelection() {
					return G.value;
				},
				get pagination() {
					return K.value;
				},
				get columnSizing() {
					return q.value;
				},
				get columnSizingInfo() {
					return te.value;
				},
				get columnVisibility() {
					return J.value;
				}
			},
			onSortingChange: (e) => {
				U.value = typeof e == "function" ? e(U.value) : e;
			},
			onColumnFiltersChange: (e) => {
				W.value = typeof e == "function" ? e(W.value) : e, F("update:column-filters", W.value);
			},
			onRowSelectionChange: (e) => {
				G.value = typeof e == "function" ? e(G.value) : e;
			},
			onPaginationChange: (e) => {
				let t = typeof e == "function" ? e(K.value) : e;
				K.value = t, le.value && F("page-change", {
					pageIndex: t.pageIndex,
					pageSize: t.pageSize
				});
			},
			onColumnSizingChange: (e) => {
				q.value = typeof e == "function" ? e(q.value) : e;
			},
			onColumnSizingInfoChange: (e) => {
				let t = te.value, n = typeof e == "function" ? e(t) : e;
				te.value = n, t.isResizingColumn && !n.isResizingColumn && F("column-resize", q.value);
			},
			onColumnVisibilityChange: (e) => {
				J.value = typeof e == "function" ? e(J.value) : e;
			},
			getCoreRowModel: I(),
			getSortedRowModel: z(),
			getFilteredRowModel: L(),
			getPaginationRowModel: R(),
			get manualPagination() {
				return le.value;
			},
			get pageCount() {
				if (le.value) return Math.ceil(f.totalCount / K.value.pageSize);
			},
			enableRowSelection: !0,
			enableMultiRowSelection: !0,
			enableColumnResizing: !0,
			columnResizeMode: "onChange",
			getRowId: (e) => e.__stagedId ? String(e.__stagedId) : String(e[ce.value] ?? e.id)
		}), ke = r(() => Object.keys(G.value).length), Ae = r(() => ke.value > 0), je = x({
			open: !1,
			mode: "insert",
			rowData: null
		});
		function Me() {
			je.value = {
				open: !0,
				mode: "insert",
				rowData: null
			};
		}
		function Ne(e) {
			je.value = {
				open: !0,
				mode: "update",
				rowData: { ...e }
			};
		}
		function Pe() {
			je.value = {
				open: !1,
				mode: "insert",
				rowData: null
			};
		}
		function Fe(e) {
			if (je.value.mode === "insert") f.stagedEdits ? _e(e) : F("insert-row", e);
			else if (f.stagedEdits) {
				let t = ce.value, n = String(e[t] ?? e.id), r = pe(n) ?? {}, i = {};
				for (let n of Object.keys(e)) n !== t && e[n] !== r[n] && (i[n] = e[n]);
				Object.keys(i).length > 0 && ye(n, i);
			} else F("update-row", {
				id: e.id,
				changes: e
			});
			Pe();
		}
		function Ie(e) {
			f.stagedEdits ? be(e) : F("delete-rows", e), Q.resetRowSelection();
		}
		function Le(e, t, n) {
			f.stagedEdits ? ye(e, { [t]: n }) : F("update-row", {
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
		function Re(e, t, n) {
			$.value = {
				show: !0,
				x: e.clientX,
				y: e.clientY,
				row: t,
				cell: n
			};
		}
		function ze() {
			$.value = {
				show: !1,
				x: 0,
				y: 0,
				row: null,
				cell: null
			};
		}
		function Be(e, t) {
			W.value.find((t) => t.id === e) ? W.value = W.value.map((n) => n.id === e ? {
				...n,
				value: {
					operator: "=",
					value: t
				}
			} : n) : W.value = [...W.value, {
				id: e,
				value: {
					operator: "=",
					value: t
				}
			}];
		}
		b("themeVars", r(() => ({
			...T.value,
			...k.value
		}))), b("table", Q), b("tableName", f.tableName), b("showDataTypes", f.showDataTypes), b("editable", V), b("showRowBorders", f.showRowBorders), b("showColumnBorders", f.showColumnBorders), b("cellButtonVisibility", r(() => f.cellButtonVisibility)), b("cellOverflow", r(() => f.cellOverflow)), b("insertRow", () => F("insert-row")), b("openInsertPanel", Me), b("emptyTitle", r(() => f.emptyTitle)), b("emptyMessage", r(() => f.emptyMessage)), b("defaultInsertLabel", r(() => f.defaultInsertLabel)), b("expanded", ae), b("toggleRowExpanded", oe), b("getSubTable", f.getSubTable), b("nestingDepth", f.nestingDepth), b("parentTheme", r(() => f.theme)), b("parentAccentColor", r(() => f.accentColor)), b("subTableSorting", Y), b("subTableColumnFilters", ne), b("subTableColumnVisibility", re), b("stagedEditsEnabled", r(() => f.stagedEdits)), b("getRowPendingState", Ce), b("getCellPendingState", we), b("getCellPreviousValue", Te), b("undoRowEdit", xe), b("undoCellEdit", Se), A(() => f.rows, () => {
			Q.resetRowSelection();
		});
		function Ve() {
			let e = {};
			if (typeof document > "u") return e;
			let t = document.createElement("canvas").getContext("2d");
			if (!t) return e;
			let n = "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif";
			if (N.value) {
				let e = getComputedStyle(N.value).fontFamily;
				e && e.trim() !== "" && (n = e);
			}
			t.font = `13px ${n}`;
			let r = Q.getAllLeafColumns(), i = H.value.slice(0, 200);
			for (let n of r) {
				let r = n.columnDef.meta || {}, a = typeof n.columnDef.header == "string" ? n.columnDef.header : String(n.id), o = t.measureText(a).width;
				if (f.showDataTypes && r.type && (o += 6 + t.measureText(r.type).width), !(r.type === "boolean" && !r.badge || r.progressBar)) {
					let e = n.columnDef.accessorKey ?? n.id;
					for (let n of i) {
						let r = n?.[e];
						if (r == null) continue;
						let i = t.measureText(String(r)).width;
						i > o && (o = i);
					}
				}
				Array.isArray(r.cellButtons) && r.cellButtons.length > 0 && (o += r.cellButtons.length * 22);
				let s = Math.ceil(o) + 16 + 28;
				e[n.id] = Math.min(Math.max(s, 60), 500);
			}
			return e;
		}
		function He(e) {
			let t = { ...Ve() }, n = e;
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
				let e = hr(r, i, o);
				r.forEach((n) => {
					t[n] = e[n];
				});
			}
			q.value = t;
		}
		let Ue = null;
		function We() {
			Ue?.disconnect(), Ue = null;
		}
		return _(() => {
			(async () => {
				await m(), await new Promise((e) => {
					requestAnimationFrame(() => e());
				});
				let e = P.value?.getScrollViewportInnerWidth?.() ?? 0;
				if (He(e), e > 0) return;
				let t = typeof P.value?.getViewportResizeObserveTarget == "function" ? P.value.getViewportResizeObserveTarget() : null;
				t && typeof ResizeObserver < "u" && (We(), Ue = new ResizeObserver(() => {
					let e = P.value?.getScrollViewportInnerWidth?.() ?? 0;
					e <= 0 || (He(e), We());
				}), Ue.observe(t));
			})();
		}), v(() => {
			We();
		}), (r, c) => (y(), o("div", {
			ref_key: "rootElRef",
			ref: N,
			class: h(["data-table-root flex flex-col text-[13px]", t.nestingDepth === 0 ? "flex-1 min-h-0 min-w-0" : ""]),
			"data-st-theme": t.theme,
			style: g(j.value)
		}, [
			t.showToolbar ? (y(), o(e, { key: 0 }, [Ae.value ? (y(), i(St, {
				key: 0,
				"selected-count": ke.value,
				table: E(Q),
				editable: V.value,
				"selection-actions": t.selectionActions,
				"enable-select-all": t.enableSelectAll,
				"count-label-singular": t.countLabelSingular,
				"count-label-plural": t.countLabelPlural,
				onDeleteRows: Ie,
				onSelectionAction: c[0] ||= (e, t) => F("selection-action", e, t)
			}, null, 8, [
				"selected-count",
				"table",
				"editable",
				"selection-actions",
				"enable-select-all",
				"count-label-singular",
				"count-label-plural"
			])) : (y(), i(pt, {
				key: 1,
				table: E(Q),
				sorting: U.value,
				"column-filters": W.value,
				"column-visibility": J.value,
				"default-column-visibility": t.defaultColumnVisibility,
				editable: V.value,
				loading: t.loading,
				"is-empty": H.value.length === 0,
				"default-insert-label": t.defaultInsertLabel,
				"insert-actions": t.insertActions,
				"toolbar-actions": t.toolbarActions,
				"toolbar-actions-label": t.toolbarActionsLabel,
				"sub-table-columns": t.subTableColumns,
				"sub-table-sorting": Y.value,
				"sub-table-column-filters": ne.value,
				"sub-table-column-visibility": re.value,
				"table-name": t.tableName,
				"onUpdate:sorting": c[1] ||= (e) => U.value = e,
				"onUpdate:columnFilters": c[2] ||= (e) => W.value = e,
				"onUpdate:columnVisibility": c[3] ||= (e) => J.value = e,
				"onUpdate:subTableSorting": c[4] ||= (e) => Y.value = e,
				"onUpdate:subTableColumnFilters": c[5] ||= (e) => ne.value = e,
				"onUpdate:subTableColumnVisibility": c[6] ||= (e) => re.value = e,
				onInsertRow: Me,
				onInsertAction: c[7] ||= (e) => F("insert-action", e),
				onRefresh: c[8] ||= (e) => F("refresh"),
				onToolbarAction: c[9] ||= (e) => F("toolbar-action", e)
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
			t.error && !ee.value ? (y(), o("div", _r, [
				c[16] ||= s("svg", {
					class: "w-3.5 h-3.5 shrink-0",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M8 1a7 7 0 100 14A7 7 0 008 1zm0 3a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 018 4zm0 8a1 1 0 110-2 1 1 0 010 2z" })], -1),
				s("span", vr, w(t.error), 1),
				s("button", {
					class: "opacity-60 hover:opacity-100",
					onClick: c[10] ||= (e) => ee.value = !0
				}, [...c[15] ||= [s("svg", {
					class: "w-3.5 h-3.5",
					viewBox: "0 0 16 16",
					fill: "currentColor"
				}, [s("path", { d: "M3.72 3.72a.75.75 0 011.06 0L8 6.94l3.22-3.22a.75.75 0 111.06 1.06L9.06 8l3.22 3.22a.75.75 0 11-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 01-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 010-1.06z" })], -1)]])
			])) : a("", !0),
			s("div", yr, [s("div", br, [u(_n, {
				ref_key: "tableGridRef",
				ref: P,
				table: E(Q),
				onUpdateCell: Le,
				onContextMenu: Re,
				onEditRow: Ne
			}, null, 8, ["table"]), t.showPagination ? (y(), i(Nn, {
				key: 0,
				table: E(Q),
				"total-count": t.totalCount,
				"has-random-access": t.hasRandomAccess,
				"staged-edits": t.stagedEdits,
				"pending-edit-count": he.value,
				committing: ue.value || t.loading,
				"count-label-singular": t.countLabelSingular,
				"count-label-plural": t.countLabelPlural,
				onCommit: De,
				onDiscard: Oe
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
				default: M(() => [(V.value.insert || V.value.update) && je.value.open ? (y(), i(or, {
					key: 0,
					mode: je.value.mode,
					"row-data": je.value.rowData,
					table: E(Q),
					"table-name": t.tableName,
					onSave: Fe,
					onClose: Pe
				}, null, 8, [
					"mode",
					"row-data",
					"table",
					"table-name"
				])) : a("", !0)]),
				_: 1
			})]),
			$.value.show ? (y(), i(fr, {
				key: 2,
				x: $.value.x,
				y: $.value.y,
				row: $.value.row,
				cell: $.value.cell,
				onClose: ze,
				onEditRow: c[11] ||= (e) => Ne($.value.row.original),
				onDeleteRow: c[12] ||= (e) => Ie([$.value.row.id]),
				onFilterByValue: Be,
				onUndoRow: c[13] ||= (e) => xe($.value.row.id),
				onUndoCell: c[14] ||= (e) => Se($.value.row.id, e)
			}, null, 8, [
				"x",
				"y",
				"row",
				"cell"
			])) : a("", !0)
		], 14, gr));
	}
}, [["__scopeId", "data-v-1e3dd0a1"]]);
//#endregion
export { Sr as DataTable };
