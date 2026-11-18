export const designPatterns = {
  id: 'design-patterns',
  title: { en: 'Design Patterns', vn: 'Mẫu thiết kế' },
  summary: {
    en: 'Evidence-driven design patterns: vocabulary, creation, structure, behavior, composition, and a production-minded capstone.',
    vn: 'Design pattern dựa trên bằng chứng: vocabulary, creation, structure, behavior, composition và capstone hướng production.',
  },
  sections: [
    {
      id: 'what-patterns-are',
      title: { en: 'What patterns are (and are not)', vn: 'Pattern là gì (và không phải là gì)' },
      baseline: {
        en: ['Can read modern JavaScript or TypeScript', 'Has changed code in a shared codebase', 'Understands functions, objects, and modules'],
        vn: ['Đọc được JavaScript hoặc TypeScript hiện đại', 'Đã sửa code trong codebase dùng chung', 'Hiểu function, object và module'],
      },
      skills: {
        en: ['Identify forces before naming a pattern', 'Compare direct and patterned designs', 'Explain pattern intent without jargon'],
        vn: ['Xác định lực tác động trước khi đặt tên pattern', 'So sánh thiết kế trực tiếp và có pattern', 'Giải thích ý định pattern không cần biệt ngữ'],
      },
      diagram: 'what-patterns-are',
      body: {
        en: `
## Analysis

A design pattern is **shared design vocabulary** for a recurring context, its competing forces, and a proven arrangement of responsibilities. It is not a library, a code template, or proof that a design is good.

Start from evidence:

- Which decisions change together?
- Which dependency causes repeated edits or incidents?
- What must remain easy to read?
- What cost would a new boundary introduce?

The useful sentence is *“payment providers vary while checkout order stays stable,”* not *“we should use Strategy.”* The first exposes a pressure; the second jumps to a shape.

Pattern names are most useful *after* the team agrees on the problem. They let reviewers compare known consequences quickly: where composition lives, which calls become indirect, and which tests must be shared. The name is shorthand for a discussion, never a replacement for it.

## Requirements

Before naming a pattern, require:

- **A recurring pressure**, demonstrated by changes, variants, or failures.
- **A stable responsibility** worth protecting from that pressure.
- **A contract** that can be stated in caller language.
- **Consequences** the team accepts: more indirection, configuration, and tests.
- A direct solution that has become meaningfully awkward.

Do not abstract a hypothetical second implementation. Keep plain code until a real variation makes the seam valuable.

## Features

A good pattern description gives reviewers five things:

1. **Context** — where the problem occurs.
2. **Forces** — goals that pull the design in different directions.
3. **Intent** — the responsibility the pattern isolates.
4. **Participants** — objects, functions, or modules and their roles.
5. **Consequences** — benefits, liabilities, and limits.

Two implementations may share the same intent without sharing syntax. JavaScript often expresses classic object patterns with functions, closures, modules, or object literals. Preserve the responsibility split, not the textbook class diagram.

## Tech choices

Use the cheapest mechanism that carries the intent:

- A **function argument** for one replaceable policy.
- A **plain object** for several related operations.
- A **module** for a process-owned resource.
- A **class** when identity, lifecycle, or polymorphic state matters.
- A framework extension point only when the framework already owns composition.

Prefer native language tools over ceremonial interfaces. TypeScript types help document contracts, but they do not make incompatible behavior substitutable.

## Design

Consider checkout with discount calculation, payment, and receipt delivery.

**Direct first:** keep the happy path visible. Then inspect change history. If regional payment providers change independently from checkout ordering, inject one narrow capability:

- Checkout owns sequence and business outcomes.
- A payment adapter owns vendor protocol.
- Receipt delivery remains explicit until its reliability needs differ.

Review the boundary by tracing one success and one provider failure. The abstraction earns its place only if both traces become clearer and provider edits stop touching checkout.

## Code

The first useful boundary can be a function, not a hierarchy:

\`\`\`js
export async function checkout(cart, charge) {
  const total = calculateTotal(cart);
  const payment = await charge({ amount: total, currency: cart.currency });
  return { orderId: crypto.randomUUID(), paymentId: payment.id };
}

const chargeWithAcme = (request) => acme.pay({
  cents: request.amount,
  currencyCode: request.currency,
});
\`\`\`

The contract is small: **charge an amount and return a payment identity**. If a second provider arrives, compare behavior for declines, timeouts, and idempotency before calling implementations interchangeable.

## Deploy

Patterns are source design, but rollout still matters:

- Add contract tests around the old behavior.
- Introduce the seam without changing outcomes.
- Move one implementation behind it.
- Compare logs, errors, and latency.
- Delete the old path after confidence is established.

Use a feature flag only when runtime rollback is valuable. A flag that survives migration becomes another permanent variant.

## Trade-offs

**Benefits**

- Shared names shorten design conversations.
- Boundaries can localize likely changes.
- Explicit contracts make testing and ownership clearer.

**Costs**

- Readers navigate more files and indirection.
- Composition moves somewhere and must be understood.
- More variants multiply contract and failure tests.

Patterns optimize particular forces; they never optimize everything. *Readability on the common path* is often more valuable than maximum extensibility.

## Failure modes

- **Pattern spotting:** labeling every conditional Strategy reverses the reasoning process.
- **Cargo-cult structure:** copying participants creates wrappers with no responsibility.
- **Name as proof:** “Factory” says nothing about correctness or lifecycle.
- **Premature generality:** options and hooks accumulate before users need them.
- **Hidden semantics:** implementations share a type but disagree on retries or errors.

Recover by inlining the ceremony, restating the pressure, and adding only the smallest seam that absorbs it.

## Practice

1. Take a function with three shipping conditionals. Build a table-driven version and a Strategy version. Compare changed files for a fourth rule.
2. Find one pattern in your codebase. Describe context, forces, contract, and consequences *without using its name*.
3. Inline a one-implementation interface. Record what became easier and what evidence would justify restoring it.
4. In review, ask: **What real change does this boundary contain?** If nobody can answer, keep the direct design.
`,
        vn: `
## Phân tích

Design pattern là **vocabulary thiết kế dùng chung** cho một bối cảnh lặp lại, các lực cạnh tranh và cách phân chia trách nhiệm đã được kiểm chứng. Nó không phải library, template code hay bằng chứng rằng thiết kế tốt.

Hãy bắt đầu bằng bằng chứng:

- Quyết định nào thường thay đổi cùng nhau?
- Dependency nào liên tục gây edit hoặc incident?
- Luồng nào phải tiếp tục dễ đọc?
- Boundary mới tạo thêm chi phí gì?

Câu hữu ích là *“payment provider thay đổi còn thứ tự checkout ổn định”*, không phải *“hãy dùng Strategy”*. Câu đầu chỉ ra áp lực thật; câu sau nhảy thẳng đến hình dạng.

## Yêu cầu

Trước khi đặt tên pattern, cần có:

- **Áp lực lặp lại** từ lịch sử thay đổi, variant hoặc failure.
- **Trách nhiệm ổn định** đáng được bảo vệ.
- **Contract** diễn đạt bằng ngôn ngữ của caller.
- **Hệ quả** team chấp nhận: thêm indirection, configuration và test.
- Một giải pháp trực tiếp đã thật sự trở nên khó sửa.

Không abstract implementation thứ hai chỉ tồn tại trong tưởng tượng. Giữ code thuần cho đến khi variation thật làm seam có giá trị.

## Tính năng

Một mô tả pattern tốt gồm năm phần:

1. **Context** — vấn đề xảy ra ở đâu.
2. **Forces** — các mục tiêu kéo thiết kế theo hướng khác nhau.
3. **Intent** — trách nhiệm cần cô lập.
4. **Participants** — object, function hoặc module cùng vai trò.
5. **Consequences** — lợi ích, nghĩa vụ và giới hạn.

Hai implementation có thể cùng intent nhưng khác cú pháp. JavaScript thường dùng function, closure, module hoặc object literal thay class diagram cổ điển.

## Công nghệ

Chọn cơ chế rẻ nhất vẫn thể hiện đúng intent:

- **Function argument** cho một policy có thể thay.
- **Plain object** cho vài operation liên quan.
- **Module** cho resource thuộc process.
- **Class** khi identity, lifecycle hoặc polymorphic state có ý nghĩa.
- Extension point của framework khi framework đã sở hữu composition.

TypeScript type giúp ghi contract, nhưng không biến behavior không tương thích thành substitutable.

## Thiết kế

Với checkout gồm discount, payment và receipt, hãy giữ happy path trực tiếp trước. Nếu lịch sử cho thấy regional provider thay đổi độc lập, inject một capability hẹp:

- Checkout sở hữu sequence và business outcome.
- Payment adapter sở hữu vendor protocol.
- Receipt vẫn explicit cho đến khi reliability của nó cần boundary riêng.

Trace một success và một provider failure. Boundary chỉ đáng giữ khi cả hai trace rõ hơn và edit provider không chạm checkout.

## Code

\`\`\`js
export async function checkout(cart, charge) {
  const total = calculateTotal(cart);
  const payment = await charge({ amount: total, currency: cart.currency });
  return { orderId: crypto.randomUUID(), paymentId: payment.id };
}

const chargeWithAcme = (request) => acme.pay({
  cents: request.amount,
  currencyCode: request.currency,
});
\`\`\`

Contract nhỏ là **charge một số tiền và trả về payment identity**. Trước khi xem provider thứ hai là thay thế được, phải so sánh decline, timeout và idempotency.

## Deploy

- Thêm contract test cho behavior cũ.
- Tạo seam nhưng chưa đổi outcome.
- Di chuyển một implementation ra sau seam.
- So sánh log, error và latency.
- Xóa path cũ sau khi đủ tự tin.

Chỉ dùng feature flag khi rollback runtime có giá trị; flag sống mãi sẽ thành variant mới.

## Trade-offs

**Lợi ích:** vocabulary rút ngắn trao đổi, boundary cô lập thay đổi, contract làm rõ ownership. **Chi phí:** thêm file để điều hướng, composition cần nơi sở hữu, variant làm tăng test.

Pattern tối ưu một số lực chứ không tối ưu mọi thứ. *Luồng chính dễ đọc* thường đáng giá hơn khả năng mở rộng tối đa.

## Phân tích lỗi

- **Săn pattern:** xem mọi conditional là Strategy.
- **Cargo cult:** chép participant nhưng không có trách nhiệm thật.
- **Tên thay bằng chứng:** “Factory” không chứng minh correctness.
- **Generality quá sớm:** hook xuất hiện trước nhu cầu.
- **Semantics ẩn:** cùng type nhưng khác retry hoặc error.

Hãy inline ceremony, viết lại áp lực và chỉ thêm seam nhỏ nhất hấp thụ được áp lực đó.

## Practice

1. Viết table-driven và Strategy cho ba shipping rule; so sánh khi thêm rule thứ tư.
2. Mô tả một pattern trong codebase mà không dùng tên của nó.
3. Inline interface chỉ có một implementation; ghi điều kiện để phục hồi.
4. Khi review, hỏi: **Boundary này chứa thay đổi thật nào?**
`,
      },
    },
    {
      id: 'solid-vocabulary',
      title: { en: 'SOLID as pattern vocabulary', vn: 'SOLID như vocabulary cho pattern' },
      baseline: {
        en: ['Understands modules and dependency direction', 'Can recognize a changing responsibility', 'Has written unit and integration tests'],
        vn: ['Hiểu module và hướng dependency', 'Nhận ra trách nhiệm đang thay đổi', 'Đã viết unit test và integration test'],
      },
      skills: {
        en: ['Use SOLID as diagnostic questions', 'Define substitutable contracts', 'Place abstractions at unstable boundaries'],
        vn: ['Dùng SOLID như câu hỏi chẩn đoán', 'Định nghĩa contract có thể thay thế', 'Đặt abstraction tại boundary không ổn định'],
      },
      diagram: 'solid-vocabulary',
      body: {
        en: `
## Analysis

SOLID works best as **five diagnostic questions**, not five commands to create classes. Patterns provide possible arrangements when those questions expose a real design pressure.

- **SRP:** Which actor or reason causes this module to change?
- **OCP:** Which variation must be added without rewriting stable policy?
- **LSP:** What behavior can callers safely assume across replacements?
- **ISP:** What is the smallest capability each caller needs?
- **DIP:** Which volatile detail should stable policy avoid importing?

The principles overlap. A narrow port can improve cohesion, substitution, and dependency direction at once. The goal is not to maximize principle compliance; it is to make change safer.

Treat each principle as a prompt during review, then return to evidence. A module may intentionally combine responsibilities because they change under one policy owner. A concrete dependency may be the correct choice because it is stable, local, and cheaper to understand than an abstraction.

## Requirements

Use SOLID only with concrete evidence:

- Identify business owners and external systems behind edits.
- Describe observable contract behavior, including errors.
- Keep abstractions near unstable boundaries.
- Preserve one readable orchestration path.
- Test substitutions against the same examples.

“One class, one responsibility” is misleading. A responsibility is a **coherent reason to change**, not a method count. Validation and authorization may belong together when the same policy owner changes them.

## Features

For a report export workflow, separate likely pressures:

1. Authorization and query validation are product policy.
2. Fetching rows is data access.
3. CSV or JSON formatting is representation policy.
4. Object storage is an infrastructure boundary.
5. Orchestration defines ordering and failure outcomes.

This map suggests seams without requiring one interface per noun. Patterns become vocabulary for the resulting choices: Strategy for format policy, Adapter for storage SDK translation, Factory for composition.

## Tech choices

In JavaScript or TypeScript:

- Use **structural types** for small capability contracts.
- Use function parameters when one operation is enough.
- Use object contracts when operations share lifecycle or state.
- Keep concrete helpers concrete if they are stable and local.
- Put construction in the composition root, not domain functions.

Avoid exposing vendor clients through a “generic” interface. That merely points dependency arrows inward while preserving vendor semantics.

## Design

Define contracts in caller language:

- Formatter: rows in, bytes and media type out.
- Destination: key plus bytes in, stored reference out.
- Export service: request in, authorized export result out.

Then define behavior:

- Empty rows still produce a valid document.
- Cancellation does not publish a partial object.
- Storage conflicts return a domain-level conflict.
- Formatting failures are not retried as network failures.

LSP is behavioral: matching method signatures is insufficient. ISP is caller-specific: an exporter should not depend on delete, list, or ACL operations it never uses.

## Code

\`\`\`js
export async function exportReport(request, { authorize, query, format, store }) {
  await authorize(request.actor, request.reportId);
  const rows = await query(request.reportId);
  const document = format(rows);
  return store({
    key: request.reportId + '.' + document.extension,
    bytes: document.bytes,
    contentType: document.contentType,
  });
}

export const csvFormatter = (rows) => ({
  extension: 'csv',
  contentType: 'text/csv',
  bytes: new TextEncoder().encode(toCsv(rows)),
});
\`\`\`

The orchestration depends on capabilities, while composition supplies concrete functions. No base class is required.

## Deploy

Refactor in observable steps:

1. Pin existing behavior with characterization tests.
2. Extract formatter without changing storage.
3. Extract destination translation.
4. Compare generated bytes and stored metadata in staging.
5. Remove access to the old all-purpose service.

Track export success, failure category, output size, and duration. Do not claim a cleaner dependency graph if operations become harder to diagnose.

## Trade-offs

**Narrow contracts** reduce test setup and vendor leakage, but they increase composition work. **Dependency inversion** protects stable policy, but misplaced inversion creates interfaces around code that never varies.

OCP is selective. Supporting another formatter without editing orchestration may be valuable; supporting arbitrary authorization engines may not be. Every extension point is also a promise to maintain compatibility.

## Failure modes

- **SRP by file size:** splitting cohesive logic into tiny files.
- **OCP everywhere:** replacing readable switches with registries and plugins.
- **Type-only LSP:** implementations disagree on empty values or partial success.
- **Fat ports:** contracts mirror entire SDKs.
- **Inverted ownership:** infrastructure defines the domain contract.
- **Mock-driven architecture:** boundaries exist only because tests prefer mocks.

Correct by restating the caller’s need and the actual reason to change. Delete abstractions whose only benefit is visual symmetry.

## Practice

1. Annotate a service with the actor or system behind each likely edit. Group by reason, not technical verb.
2. Write one substitution table covering success, empty input, cancellation, and failure for two implementations.
3. Reduce a storage interface to the operations one caller uses.
4. Review a pattern and state which SOLID question it answers. If it answers none, explain why it still earns its cost.
`,
        vn: `
## Phân tích

SOLID hữu ích nhất như **năm câu hỏi chẩn đoán**, không phải năm mệnh lệnh tạo class.

- **SRP:** Actor hay lý do nào làm module đổi?
- **OCP:** Variation nào cần thêm mà không viết lại policy ổn định?
- **LSP:** Caller được phép tin behavior nào ở mọi replacement?
- **ISP:** Capability nhỏ nhất mỗi caller cần là gì?
- **DIP:** Detail dễ đổi nào không nên bị stable policy import?

Pattern cung cấp arrangement khi các câu hỏi này chỉ ra áp lực thật. Mục tiêu là thay đổi an toàn, không phải tối đa hóa “điểm SOLID”.

## Yêu cầu

- Xác định business owner và external system đứng sau edit.
- Mô tả contract quan sát được, gồm cả error.
- Đặt abstraction gần unstable boundary.
- Giữ orchestration path dễ đọc.
- Chạy cùng contract example cho mọi implementation.

“Mỗi class một trách nhiệm” là cách hiểu sai. Trách nhiệm là **một lý do thay đổi có tính gắn kết**, không phải số lượng method.

## Tính năng

Trong report export:

1. Authorization và query validation là product policy.
2. Fetch row là data access.
3. CSV/JSON formatting là representation policy.
4. Object storage là infrastructure boundary.
5. Orchestration quyết định thứ tự và failure outcome.

Map này gợi ý Strategy cho format, Adapter cho storage SDK và Factory tại composition root, nhưng không bắt buộc interface cho mọi noun.

## Công nghệ

- Dùng **structural type** cho capability nhỏ.
- Dùng function parameter khi chỉ có một operation.
- Dùng object contract khi các operation chia sẻ lifecycle.
- Giữ helper local, ổn định ở dạng concrete.
- Đặt construction tại composition root.

Không đưa vendor client vào interface “generic”; làm vậy chỉ đổi mũi tên dependency chứ chưa loại vendor semantics.

## Thiết kế

Contract theo ngôn ngữ caller:

- Formatter nhận rows, trả bytes và media type.
- Destination nhận key + bytes, trả stored reference.
- Export service nhận request, trả authorized result.

Behavior phải rõ: empty rows vẫn tạo document hợp lệ; cancellation không publish partial object; conflict được map thành domain error; formatting failure không retry như network failure.

LSP thuộc behavior, không chỉ signature. ISP theo caller; exporter không cần delete, list hoặc ACL.

## Code

\`\`\`js
export async function exportReport(request, { authorize, query, format, store }) {
  await authorize(request.actor, request.reportId);
  const rows = await query(request.reportId);
  const document = format(rows);
  return store({
    key: request.reportId + '.' + document.extension,
    bytes: document.bytes,
    contentType: document.contentType,
  });
}
\`\`\`

Orchestration phụ thuộc capability; composition cung cấp function concrete. Không cần base class.

## Deploy

1. Pin behavior bằng characterization test.
2. Extract formatter nhưng chưa đổi storage.
3. Extract phần dịch destination.
4. So sánh bytes và metadata ở staging.
5. Xóa quyền truy cập service cũ.

Theo dõi success, failure category, output size và duration.

## Trade-offs

Contract hẹp giảm test setup và vendor leakage nhưng tăng composition. DIP bảo vệ stable policy, nhưng inversion sai chỗ tạo interface quanh code không bao giờ đổi.

OCP phải có chọn lọc. Extension point luôn là một lời hứa compatibility cần duy trì.

## Phân tích lỗi

- **SRP theo kích thước file:** chia logic cohesive thành mảnh nhỏ.
- **OCP mọi nơi:** thay switch rõ ràng bằng registry.
- **LSP chỉ ở type:** implementation khác behavior.
- **Port quá béo:** sao chép toàn bộ SDK.
- **Ownership đảo ngược:** infrastructure định nghĩa domain contract.
- **Architecture theo mock:** boundary chỉ tồn tại vì test thích mock.

## Practice

1. Gắn mỗi nhóm dòng với actor/lý do thay đổi.
2. Viết substitution table cho success, empty, cancellation và failure.
3. Thu nhỏ storage interface theo đúng caller.
4. Nêu câu hỏi SOLID mà mỗi pattern đang trả lời.
`,
      },
    },
    {
      id: 'creational-factory-builder',
      title: { en: 'Creational: Factory / Builder', vn: 'Creational: Factory / Builder' },
      baseline: {
        en: ['Understands constructors and object composition', 'Can model validation rules', 'Knows dependency injection basics'],
        vn: ['Hiểu constructor và object composition', 'Mô hình hóa được validation rule', 'Biết dependency injection cơ bản'],
      },
      skills: {
        en: ['Centralize variant selection with factories', 'Build valid complex values incrementally', 'Keep construction at the composition root'],
        vn: ['Tập trung lựa chọn variant bằng factory', 'Xây giá trị phức tạp hợp lệ theo từng bước', 'Giữ construction tại composition root'],
      },
      diagram: 'creational-factory-builder',
      body: {
        en: `
## Analysis

Creation becomes a design problem when callers must know **which variant**, **which dependencies**, or **which construction order** produces a valid value.

- A **Factory** centralizes selection and wiring.
- A **Builder** accumulates inputs and validates a complex final value.

Neither pattern exists to hide a one-line constructor. Use them when construction knowledge is duplicated, conditional, or easy to get wrong.

Creation logic also marks a **trust transition**. Raw environment variables, request fields, and SDK options should be validated before they become application objects. Centralizing that transition can prevent inconsistent defaults and make secrets, ownership, and lifecycle visible in one place.

## Requirements

A Factory should:

- Accept a small, explicit selection input.
- Return products with a stable behavioral contract.
- Fail fast on unsupported variants.
- Keep credentials and vendor wiring outside domain code.
- Avoid becoming a service locator.

A Builder should:

- Make required fields visible.
- Prevent invalid final objects.
- Define whether it is reusable after \`build()\`.
- Copy mutable inputs or document ownership.
- Report validation errors in caller language.

## Features

Imagine notification delivery:

- Email, SMS, and push share a \`send(message)\` capability.
- Vendor clients need different credentials and timeout settings.
- Campaign requests contain optional schedule, audience, and tracking rules.

The Factory chooses a channel adapter at the composition edge. The Builder constructs a valid campaign command. The application workflow consumes both without learning vendor constructors or partially valid state.

## Tech choices

Prefer:

- A **switch expression** in one factory over a dynamic registry for a closed set.
- A plain object return value over classes when there is no identity.
- A fluent Builder only when staged readability beats a validated function.
- Schema validation at external input boundaries.
- Constructor injection for long-lived dependencies.

For many JavaScript values, \`createCampaign(input)\` plus validation is simpler than a Builder. Choose Builder when incremental assembly is genuinely needed across steps.

Choose a class-based Builder only if its stateful sequence is part of the useful API. Otherwise, pass a draft object between explicit functions or collect fields in a UI layer and validate once. Fluent syntax alone is not a design benefit.

## Design

Place creation at the **composition root**:

1. Read trusted configuration.
2. Create vendor clients.
3. Select adapters.
4. Construct the workflow.
5. Pass the ready workflow to request handling.

Do not call factories deep inside business functions; that hides dependencies and complicates tests.

For Builder state, distinguish **missing**, **invalid**, and **defaulted** fields. Validate cross-field rules only when enough information exists, then validate everything again at build time.

## Code

\`\`\`js
export function createNotifier(channel, clients) {
  switch (channel) {
    case 'email': return (message) => clients.email.send(toEmail(message));
    case 'sms': return (message) => clients.sms.publish(toSms(message));
    default: throw new Error('Unsupported channel: ' + channel);
  }
}

export class CampaignBuilder {
  #draft = { tracking: false };

  audience(ids) { this.#draft.audienceIds = [...ids]; return this; }
  message(text) { this.#draft.message = text.trim(); return this; }
  tracking(enabled = true) { this.#draft.tracking = enabled; return this; }

  build() {
    if (!this.#draft.audienceIds?.length) throw new Error('Audience is required');
    if (!this.#draft.message) throw new Error('Message is required');
    return Object.freeze({ ...this.#draft });
  }
}
\`\`\`

The Factory owns variant knowledge; the Builder owns validity. Neither owns sending or campaign execution.

## Deploy

- Add parity tests for every existing variant.
- Route one channel through the Factory.
- Compare vendor request payloads in a sandbox.
- Migrate remaining call sites.
- Make direct vendor construction inaccessible from feature modules.

For a Builder migration, accept old input at the boundary and convert it once. Avoid supporting old and new construction styles indefinitely.

## Trade-offs

**Factory**

- Gains: centralized selection, consistent wiring, easier adapter tests.
- Costs: one more place to update; can grow into a dependency grab bag.

**Builder**

- Gains: readable staged assembly, centralized invariants.
- Costs: mutable intermediate state, extra API surface, ordering ambiguity.

An ordinary validated function is often better for small immutable values. A switch is often better than runtime plugin discovery for a known product set.

## Failure modes

- **Factory as service locator:** callers request arbitrary dependencies by string.
- **God factory:** one module constructs unrelated subsystems.
- **Async surprise:** some products are promises while others are values.
- **Invalid builder state:** \`build()\` returns incomplete data.
- **Leaked mutation:** caller changes an array after build.
- **Fluent theater:** ten chainable setters wrap a plain object with no invariants.

Keep each factory scoped to one product family. Make product lifecycle and return type uniform. Replace an unnecessary Builder with one validated creation function.

## Practice

1. Centralize two payment adapter constructors in a switch-based Factory; test unsupported input.
2. Write contract tests that both products handle success, rejection, and timeout consistently.
3. Build a campaign with one cross-field rule: scheduled campaigns require a timezone.
4. Replace the Builder with \`createCampaign(input)\`. Compare call-site clarity and choose the smaller API.
`,
        vn: `
## Phân tích

Creation trở thành vấn đề thiết kế khi caller phải biết **variant nào**, **dependency nào** hoặc **thứ tự nào** mới tạo được value hợp lệ.

- **Factory** tập trung việc chọn và wiring.
- **Builder** tích lũy input rồi validate final value phức tạp.

Không dùng hai pattern này để che một constructor một dòng. Chúng phù hợp khi knowledge về construction bị lặp, có conditional hoặc dễ sai.

## Yêu cầu

Factory cần input chọn nhỏ, contract ổn định, fail fast với variant lạ và không biến thành service locator. Builder phải làm rõ required field, ngăn final object invalid, xác định khả năng reuse và bảo vệ mutable input.

Validation error phải theo ngôn ngữ caller, không lộ chi tiết vendor.

## Tính năng

Trong notification delivery:

- Email, SMS và push cùng capability \`send(message)\`.
- Mỗi vendor client có credential và timeout khác.
- Campaign có schedule, audience và tracking rule tùy chọn.

Factory chọn channel adapter ở composition edge. Builder tạo campaign command hợp lệ. Workflow không biết vendor constructor hay partial state.

## Công nghệ

- Dùng **switch** thay registry động cho tập variant đóng.
- Trả plain object nếu không có identity.
- Chỉ dùng fluent Builder khi assembly nhiều bước thật sự dễ đọc hơn.
- Validate schema tại external boundary.
- Inject dependency sống lâu qua constructor/composition.

Với value nhỏ, \`createCampaign(input)\` thường đơn giản hơn Builder.

## Thiết kế

Tại **composition root**:

1. Đọc trusted config.
2. Tạo vendor client.
3. Chọn adapter.
4. Construct workflow.
5. Giao workflow hoàn chỉnh cho request handler.

Không gọi factory sâu trong business function. Builder cần phân biệt field missing, invalid và defaulted; validate cross-field rule ở build time.

## Code

\`\`\`js
export function createNotifier(channel, clients) {
  switch (channel) {
    case 'email': return (message) => clients.email.send(toEmail(message));
    case 'sms': return (message) => clients.sms.publish(toSms(message));
    default: throw new Error('Unsupported channel: ' + channel);
  }
}

export function createCampaign(input) {
  if (!input.audienceIds?.length) throw new Error('Audience is required');
  if (!input.message?.trim()) throw new Error('Message is required');
  return Object.freeze({ tracking: false, ...input });
}
\`\`\`

Factory sở hữu variant knowledge; creation function/Builder sở hữu validity.

## Deploy

- Thêm parity test cho từng variant.
- Route một channel qua Factory.
- So sánh vendor payload trong sandbox.
- Migrate các caller còn lại.
- Chặn feature module construct vendor trực tiếp.

Với Builder, convert old input một lần ở boundary; không duy trì hai style mãi.

## Trade-offs

Factory tập trung wiring nhưng dễ thành dependency grab bag. Builder làm rõ assembly và invariant nhưng tạo mutable intermediate state, API rộng và ordering ambiguity.

Function validation thường tốt hơn với immutable value nhỏ; switch thường tốt hơn plugin discovery với product set đã biết.

## Phân tích lỗi

- **Service locator:** lấy dependency bất kỳ bằng string.
- **God factory:** construct nhiều subsystem không liên quan.
- **Async surprise:** product lúc là Promise, lúc là value.
- **Builder invalid:** trả object thiếu field.
- **Mutation leak:** caller sửa array sau build.
- **Fluent theater:** setter chain không bảo vệ invariant.

## Practice

1. Tạo Factory cho hai payment adapter và test input lạ.
2. Chạy cùng contract test cho success, rejection, timeout.
3. Thêm rule scheduled campaign cần timezone.
4. So sánh Builder với một hàm \`createCampaign\`.
`,
      },
    },
    {
      id: 'creational-singleton',
      title: { en: 'Creational: Singleton (when not to)', vn: 'Creational: Singleton (khi không nên dùng)' },
      baseline: {
        en: ['Understands module scope and process lifetime', 'Has debugged shared mutable state', 'Knows basic concurrency concerns'],
        vn: ['Hiểu module scope và process lifetime', 'Đã debug shared mutable state', 'Biết vấn đề concurrency cơ bản'],
      },
      skills: {
        en: ['Distinguish one instance from global access', 'Choose explicit lifecycle ownership', 'Test process-scoped resources safely'],
        vn: ['Phân biệt một instance với global access', 'Chọn lifecycle ownership tường minh', 'Test resource theo process an toàn'],
      },
      diagram: 'creational-singleton',
      body: {
        en: `
## Analysis

Singleton combines two different claims:

1. Only one instance should exist in a scope.
2. Everyone should access it globally.

The first can be valid for a connection pool, metrics registry, or hardware handle. The second usually hides dependencies and shared mutable state. **One owned instance does not require global access.**

In JavaScript, an exported module value is already cached per module graph in common runtimes. Adding a \`getInstance()\` class often adds ceremony without stronger guarantees.

The key design question is **ownership**, not instance count. A resource with one owner can still be passed to hundreds of callers safely. Conversely, a globally reachable object can be instantiated once yet remain unsafe because any caller can mutate it at any time.

## Requirements

Before choosing one instance, define the scope:

- Per request, tenant, worker, process, browser tab, or deployment?
- Who creates and closes it?
- Can initialization fail or be retried?
- Is state mutable, and who synchronizes changes?
- How do tests replace or reset it?

“The application” is not a precise scope. Serverless deployments, worker threads, test runners, and horizontally scaled processes each create multiple runtime instances.

Also define the resource budget. A pool of ten connections in eight workers across six replicas means up to 480 connections, not ten. Similar multiplication applies to timers, caches, sockets, file descriptors, and background consumers.

## Features

Use explicit lifecycle ownership:

- The composition root creates one pool per process.
- Request handlers receive the pool or a repository built from it.
- Shutdown hooks close the pool.
- Health checks observe readiness without constructing another pool.

This gives resource uniqueness *within the chosen process* while keeping feature dependencies visible.

Good candidates are scarce resources with clear lifecycle. Poor candidates include current user, request context, feature flags, carts, and mutable configuration.

## Tech choices

Prefer, in order:

1. **Dependency injection** of one composition-owned value.
2. A module export for immutable configuration or stateless utilities.
3. Runtime context mechanisms for request-local data.
4. A guarded lazy initializer only when startup cost or ordering requires it.

Do not use a global map as a substitute for tenant scoping. Do not store secrets or user identity in process-wide mutable state.

## Design

For a database pool:

- \`createApp(config)\` constructs the pool once.
- Repositories capture the pool.
- Routes capture repositories.
- \`close()\` drains traffic, then closes resources.

If lazy initialization is needed, cache the **in-flight promise**, not only the completed value. Otherwise concurrent requests may create duplicates. Decide what happens after rejection: clear the promise for retry or preserve the failure to fail fast.

Tests should create an app with fake dependencies. They should not mutate a shared singleton and hope cleanup runs.

Separate immutable process configuration from mutable runtime health. Freezing configuration is useful; freezing a client object is not a concurrency strategy. If shared state is unavoidable, expose narrow atomic operations and document their synchronization guarantees.

## Code

\`\`\`js
export function createApp({ createPool, config }) {
  const pool = createPool(config.databaseUrl);
  const users = createUserRepository(pool);

  return {
    handle: createHttpHandler({ users }),
    close: () => pool.close(),
  };
}

let poolPromise;
export function getProcessPool(createPool) {
  poolPromise ??= Promise.resolve().then(createPool).catch((error) => {
    poolPromise = undefined;
    throw error;
  });
  return poolPromise;
}
\`\`\`

The first example is preferred. The guarded initializer is appropriate only where the runtime forces deferred process ownership.

## Deploy

- Start resources before declaring readiness.
- Stop accepting traffic before closing them.
- Set connection limits per process, then multiply by replica count.
- Expose pool saturation and initialization failures.
- Verify rolling deploys do not exceed database limits.

A “singleton” does not coordinate across replicas. Distributed uniqueness requires a database constraint, lease, lock, or elected owner.

## Trade-offs

**Explicit one-instance composition** keeps dependencies testable and lifecycle visible, but requires parameter plumbing. **Global access** is convenient at first, but couples every caller to process state and import timing.

Lazy creation reduces unused startup work but moves failure into request time. Eager creation fails fast but may slow startup. Choose from operational requirements, not pattern preference.

## Failure modes

- **False uniqueness:** each worker or replica has its own instance.
- **Import-time side effect:** merely importing a module opens connections.
- **Test contamination:** mutable state survives between tests.
- **Race on lazy init:** concurrent requests create several resources.
- **Uncloseable resource:** ownership is global but shutdown is nowhere.
- **Request leakage:** user-specific state is stored process-wide.

Fix by naming the scope, moving ownership to composition, and passing the capability explicitly. Use platform primitives for distributed coordination.

## Practice

1. Replace a \`UserSession.getInstance()\` with request-local context.
2. Write a concurrency test proving a lazy initializer invokes its factory once.
3. Calculate total database connections for workers × replicas × pool size.
4. Refactor a module-level client into \`createApp()\`; test that \`close()\` runs exactly once.
`,
        vn: `
## Phân tích

Singleton gộp hai khẳng định:

1. Chỉ nên có một instance trong một scope.
2. Mọi nơi nên truy cập nó bằng global.

Điều đầu có thể đúng với connection pool hay hardware handle. Điều sau thường che dependency và shared mutable state. **Một instance được sở hữu rõ không cần global access.**

Trong nhiều JavaScript runtime, module export đã được cache theo module graph; class \`getInstance()\` thường chỉ thêm ceremony.

## Yêu cầu

Phải xác định scope: request, tenant, worker, process, tab hay deployment. Đồng thời trả lời:

- Ai tạo và đóng resource?
- Init fail có retry không?
- State có mutable không?
- Test replace/reset bằng cách nào?

“Toàn application” không đủ chính xác; serverless, worker thread và replica đều tạo nhiều instance.

## Tính năng

- Composition root tạo một pool mỗi process.
- Handler nhận pool hoặc repository.
- Shutdown hook đóng pool.
- Health check quan sát readiness mà không tạo resource mới.

Candidate tốt là scarce resource có lifecycle rõ. Current user, cart, request context và mutable config là candidate xấu.

## Công nghệ

Ưu tiên:

1. **Dependency injection** của value do composition sở hữu.
2. Module export cho immutable config/stateless utility.
3. Request context của runtime.
4. Lazy initializer có guard khi thật sự cần.

Không dùng global map thay tenant scope; không lưu identity trong process-wide state.

## Thiết kế

\`createApp(config)\` tạo pool, repository và route; \`close()\` drain traffic rồi đóng resource.

Nếu lazy init, cache **in-flight Promise** để request đồng thời không tạo duplicate. Sau rejection, quyết định clear để retry hay giữ failure để fail fast.

Test nên tạo app với fake dependency, không mutate singleton dùng chung.

## Code

\`\`\`js
export function createApp({ createPool, config }) {
  const pool = createPool(config.databaseUrl);
  const users = createUserRepository(pool);
  return {
    handle: createHttpHandler({ users }),
    close: () => pool.close(),
  };
}

let poolPromise;
export function getProcessPool(createPool) {
  poolPromise ??= Promise.resolve().then(createPool).catch((error) => {
    poolPromise = undefined;
    throw error;
  });
  return poolPromise;
}
\`\`\`

Ưu tiên ví dụ đầu; guard lazy chỉ phù hợp khi runtime ép deferred ownership.

## Deploy

- Tạo resource trước readiness.
- Ngừng nhận traffic trước close.
- Tính connection limit theo process × replica.
- Đo saturation và init failure.
- Kiểm tra rolling deploy không vượt database limit.

Singleton không điều phối giữa replica; distributed uniqueness cần constraint, lease hoặc lock.

## Trade-offs

Composition explicit dễ test và rõ lifecycle nhưng cần truyền parameter. Global access tiện lúc đầu nhưng couple caller với process state và import timing.

Lazy init giảm startup work nhưng đưa failure vào request; eager init fail fast nhưng startup chậm hơn.

## Phân tích lỗi

- **Uniqueness giả:** mỗi worker có instance riêng.
- **Import side effect:** import đã mở connection.
- **Test contamination:** state sống qua test.
- **Lazy race:** tạo nhiều resource.
- **Không có owner đóng:** shutdown leak.
- **Request leakage:** user state nằm global.

## Practice

1. Thay \`UserSession.getInstance()\` bằng request context.
2. Test concurrent lazy init chỉ gọi factory một lần.
3. Tính tổng connection của deployment.
4. Refactor module client vào \`createApp()\` và test \`close()\`.
`,
      },
    },
    {
      id: 'structural-adapter-facade',
      title: { en: 'Structural: Adapter / Facade', vn: 'Structural: Adapter / Facade' },
      baseline: {
        en: ['Understands API boundaries', 'Can translate data shapes', 'Has integrated an external SDK'],
        vn: ['Hiểu API boundary', 'Biết chuyển đổi data shape', 'Đã tích hợp external SDK'],
      },
      skills: {
        en: ['Translate vendor semantics with adapters', 'Simplify subsystems with facades', 'Prevent external types from leaking inward'],
        vn: ['Dịch vendor semantics bằng adapter', 'Đơn giản hóa subsystem bằng facade', 'Ngăn external type rò vào trong'],
      },
      diagram: 'structural-adapter-facade',
      body: {
        en: `
## Analysis

Both patterns protect callers from complexity, but at different boundaries:

- An **Adapter** translates one interface or semantic model into another.
- A **Facade** offers a smaller, task-oriented entry point to a complex subsystem.

An Adapter answers *“how does our capability map to this dependency?”* A Facade answers *“what is the simplest operation callers need from this subsystem?”*

Translation is more than renaming fields. Error categories, units, pagination, idempotency, and time semantics are part of the boundary.

A strong boundary also limits the **blast radius of vendor change**. When an SDK renames fields, changes pagination tokens, or introduces a new exception, only the adapter and its tests should need edits. If feature modules change too, the boundary is leaking.

## Requirements

An Adapter must:

- Accept domain-oriented inputs.
- Contain vendor request and response types.
- Map vendor failures into stable application outcomes.
- Preserve important metadata such as retry hints.
- Be covered by contract tests and a few integration tests.

A Facade must:

- Expose complete business tasks, not low-level steps.
- Keep transaction and ordering rules inside the subsystem.
- Avoid becoming a miscellaneous “manager.”
- Let advanced internal APIs remain private.

## Features

For document storage, a vendor SDK may require bucket names, streams, ACLs, and provider exceptions. The application only needs:

- Store a document under a key.
- Retrieve a document or report it missing.
- Delete one document idempotently.

An Adapter translates those operations to the SDK. A document Facade can additionally coordinate virus scanning, metadata persistence, and audit events as one \`publishDocument\` task.

## Tech choices

- Define ports in the **consumer’s module**.
- Use explicit mapping functions for external data.
- Normalize units at the edge: bytes, milliseconds, UTC timestamps.
- Preserve original errors as \`cause\` for diagnostics.
- Keep Facades coarse enough to complete a use case.

Do not mirror every SDK method “for future flexibility.” That produces a leaky wrapper with the maintenance cost of both APIs.

Keep mapping code deliberately boring. Explicit field assignments are easier to review than reflective mappers when money, identifiers, or permissions are involved. Reject unknown required values rather than silently dropping them during translation.

## Design

Boundary flow:

1. Validate domain input before the vendor call.
2. Convert names, units, and representation.
3. Invoke the SDK with timeout and cancellation.
4. Classify vendor responses.
5. Return a stable domain result.

The Facade sits above adapters and domain services. It can own sequencing, but it should not absorb every policy in the application. Keep authorization at the layer that owns user policy, and keep raw vendor details inside adapters.

Document error mapping in a table: vendor not-found → \`DocumentMissing\`; throttling → retryable; invalid key → caller error; unknown 5xx → unavailable with cause.

## Code

\`\`\`js
export function createBlobStore(sdk, bucket) {
  return {
    async put({ key, bytes, contentType, signal }) {
      try {
        const result = await sdk.upload({
          bucket,
          objectName: key,
          body: bytes,
          mime: contentType,
          signal,
        });
        return { key, version: result.versionId };
      } catch (error) {
        if (error.code === 'THROTTLED') {
          throw new StorageUnavailable('Storage throttled', { cause: error });
        }
        throw error;
      }
    },
  };
}

export async function publishDocument(input, { scan, store, metadata }) {
  await scan(input.bytes);
  const object = await store.put(input);
  await metadata.record({ ...object, ownerId: input.ownerId });
  return object;
}
\`\`\`

The first function is an Adapter; the second is a task-oriented Facade.

## Deploy

- Capture current vendor payload fixtures.
- Add adapter contract tests with a fake SDK.
- Run sandbox integration tests for authentication and error mapping.
- Route a small traffic percentage through the adapter.
- Compare success, latency, retry, and error-class metrics.

Sanitize logs at the boundary. Vendor payloads may contain secrets or customer data. Keep a rollback path until stored-object compatibility is confirmed.

## Trade-offs

Adapters reduce vendor leakage and make replacement possible, but every translation can lose useful detail. Preserve details needed for operations without exporting the vendor’s type system.

Facades make common tasks easy and enforce ordering, but a facade that serves unrelated callers can become a god service. Prefer several cohesive task facades to one universal gateway.

## Failure modes

- **Pass-through adapter:** method names change, semantics do not.
- **Leaky types:** vendor enums spread through domain code.
- **Error flattening:** all failures become “storage failed.”
- **Facade as bag:** unrelated methods collect in one class.
- **Chatty facade:** caller still coordinates seven subsystem calls.
- **Double retry:** adapter and caller both retry, multiplying load.

Fix the contract around caller needs, assign retry ownership once, and retain diagnostic causes behind stable error categories.

## Practice

1. Adapt a fictional payments SDK whose amounts use cents and errors use numeric codes.
2. Write an error mapping table before writing the adapter.
3. Create a Facade for “publish document” and identify which transaction boundaries are local.
4. Search a codebase for vendor types outside integration modules; propose one boundary to stop the leak.
`,
        vn: `
## Phân tích

Hai pattern cùng bảo vệ caller khỏi complexity nhưng ở boundary khác:

- **Adapter** dịch interface hoặc semantic model.
- **Facade** cung cấp entry point nhỏ theo task cho subsystem phức tạp.

Adapter trả lời “capability của ta map vào dependency thế nào?”. Facade trả lời “operation đơn giản nhất caller cần là gì?”. Translation gồm cả error, unit, pagination, idempotency và time semantics.

## Yêu cầu

Adapter nhận domain input, giữ vendor type bên trong, map failure ổn định và giữ metadata vận hành cần thiết. Facade expose business task hoàn chỉnh, sở hữu ordering/transaction rule nhưng không thành “manager” chứa mọi thứ.

Contract test kiểm chứng behavior; integration test kiểm chứng giả định thật về SDK.

## Tính năng

Với document storage, application chỉ cần:

- Store document theo key.
- Retrieve hoặc báo missing.
- Delete idempotently.

Adapter dịch sang bucket, stream, ACL và provider exception. Facade \`publishDocument\` có thể phối hợp scan, lưu object, metadata và audit.

## Công nghệ

- Định nghĩa port trong **module consumer**.
- Mapping external data bằng function tường minh.
- Normalize byte, millisecond và UTC ở edge.
- Giữ original error trong \`cause\`.
- Facade đủ coarse để hoàn thành use case.

Không mirror toàn bộ SDK “để linh hoạt”.

## Thiết kế

1. Validate domain input.
2. Convert tên, unit và representation.
3. Call SDK với timeout/cancellation.
4. Classify response.
5. Trả domain result ổn định.

Facade nằm trên adapter và domain service. Authorization vẫn ở layer sở hữu user policy; raw vendor detail ở adapter.

Lập bảng mapping: not-found → \`DocumentMissing\`; throttling → retryable; invalid key → caller error; 5xx lạ → unavailable kèm cause.

## Code

\`\`\`js
export function createBlobStore(sdk, bucket) {
  return {
    async put({ key, bytes, contentType, signal }) {
      try {
        const result = await sdk.upload({
          bucket, objectName: key, body: bytes, mime: contentType, signal,
        });
        return { key, version: result.versionId };
      } catch (error) {
        if (error.code === 'THROTTLED') {
          throw new StorageUnavailable('Storage throttled', { cause: error });
        }
        throw error;
      }
    },
  };
}
\`\`\`

Adapter giữ vendor protocol; Facade phía trên điều phối task.

## Deploy

- Lưu fixture payload hiện tại.
- Thêm contract test với fake SDK.
- Chạy sandbox test cho auth và error.
- Route một phần traffic.
- So sánh success, latency, retry và error class.

Sanitize log ở boundary vì payload có thể chứa secret hoặc customer data.

## Trade-offs

Adapter giảm leakage nhưng translation có thể mất detail; giữ detail vận hành mà không export type system vendor. Facade đơn giản hóa task nhưng dễ thành god service nếu phục vụ nhiều caller không liên quan.

## Phân tích lỗi

- **Pass-through adapter:** chỉ đổi tên method.
- **Leaky type:** vendor enum lan vào domain.
- **Error flattening:** mọi lỗi thành một message.
- **Facade dạng túi:** method không liên quan gom chung.
- **Facade quá chatty:** caller vẫn tự điều phối.
- **Double retry:** adapter và caller cùng retry.

## Practice

1. Adapt payment SDK dùng cents và numeric error.
2. Viết error mapping table trước code.
3. Tạo Facade “publish document”.
4. Tìm vendor type rò khỏi integration module.
`,
      },
    },
    {
      id: 'structural-decorator-proxy',
      title: { en: 'Structural: Decorator / Proxy', vn: 'Structural: Decorator / Proxy' },
      baseline: {
        en: ['Understands composition and delegation', 'Can reason about async errors', 'Knows caching and authorization basics'],
        vn: ['Hiểu composition và delegation', 'Suy luận được async error', 'Biết caching và authorization cơ bản'],
      },
      skills: {
        en: ['Layer behavior with decorators', 'Control access through proxies', 'Preserve contract semantics across wrappers'],
        vn: ['Xếp lớp behavior bằng decorator', 'Kiểm soát access qua proxy', 'Giữ contract semantics qua wrapper'],
      },
      diagram: 'structural-decorator-proxy',
      body: {
        en: `
## Analysis

Decorator and Proxy both wrap a compatible contract and delegate, but their intent differs:

- A **Decorator** adds composable behavior such as metrics, caching, or retries.
- A **Proxy** controls access to another object because of location, cost, authorization, or lifecycle.

The wrapper must preserve the original contract. If callers see different success values, error categories, cancellation behavior, or timing guarantees, the wrapper is not transparent and must document the difference.

Think of each wrapper as a function from one valid implementation of a contract to another. This framing makes tests straightforward: run the same behavioral examples against the bare implementation and every composed stack, then add focused tests for the new side effect.

## Requirements

For every wrapper, define:

- Which method or capability it wraps.
- Whether it changes only side effects or also results.
- Ordering relative to other wrappers.
- Ownership of retries, caching, and authorization.
- Behavior on cancellation and partial failure.

Wrappers should be independently testable. Avoid reaching into delegate internals. Preserve \`this\` binding when wrapping methods, or expose plain capability functions.

## Features

For a product repository:

- A metrics Decorator records duration and outcome.
- A cache Decorator serves safe repeated reads.
- A retry Decorator retries transient reads only.
- An authorization Proxy rejects requests before repository access.
- A remote Proxy makes network location look like the same capability.

These concerns compose, but order matters. Authorization should run before cache access if cache entries are not universally visible. Metrics outside retries measures user-visible latency; metrics inside measures each attempt.

## Tech choices

- Prefer higher-order functions for a single operation.
- Use object wrappers for multi-method contracts.
- Use \`AbortSignal\` for cancellation propagation.
- Use bounded caches with explicit keys and TTL.
- Restrict retries to idempotent operations and transient errors.

Native JavaScript \`Proxy\` is rarely required for the Proxy pattern. Explicit wrappers are easier to type, trace, and optimize.

Use middleware when the platform already defines ordering and context propagation, but keep domain-specific rules close to domain capabilities. A global HTTP retry middleware, for example, cannot know whether a payment request is safe to repeat.

## Design

Specify wrapper order at composition:

\`authorize → measure → cache → retry → remote repository\`

Then challenge it:

- Should unauthorized misses affect latency metrics?
- Can one tenant read another tenant’s cache key?
- Does retry happen before or after timeout budget exhaustion?
- Are negative results cacheable?

Cache keys must include every input affecting the result. Retry must use a shared deadline, not reset the full timeout per attempt. Metrics must avoid high-cardinality labels such as user IDs.

## Code

\`\`\`js
export const withMetrics = (load, metrics) => async (id, options = {}) => {
  const started = performance.now();
  try {
    const value = await load(id, options);
    metrics.count('product_load', { outcome: 'ok' });
    return value;
  } catch (error) {
    metrics.count('product_load', { outcome: 'error' });
    throw error;
  } finally {
    metrics.timing('product_load_ms', performance.now() - started);
  }
};

export const authorizedProductLoader = (load, canRead) =>
  async (actor, id, options) => {
    if (!await canRead(actor, id)) throw new ForbiddenError();
    return load(id, options);
  };
\`\`\`

Both wrappers delegate. Metrics decorates behavior; authorization proxies access.

## Deploy

- Add wrappers one at a time.
- Compare return values and error classes with contract tests.
- Enable metrics first to establish a baseline.
- Roll out cache by traffic percentage and watch stale-read reports.
- Bound retry attempts and measure amplification.

Expose cache hit rate, delegate latency, attempt count, and rejection count. A wrapper that hides operational behavior is harder to trust than direct code.

## Trade-offs

Composition avoids subclass explosion and keeps cross-cutting behavior reusable. The cost is **order-dependent behavior** and deeper traces.

Caching improves latency and load but introduces staleness and invalidation. Retry improves transient resilience but raises latency and downstream traffic. Authorization centralizes access control but can become a hidden network dependency.

Keep the stack short. If understanding one call requires opening six wrappers, merge cohesive behavior or move it to platform middleware.

## Failure modes

- **Contract drift:** wrapper converts “missing” into \`undefined\` while delegate throws.
- **Lost cancellation:** wrapper does not forward \`AbortSignal\`.
- **Cache leak:** key omits tenant or permission scope.
- **Retry storm:** nested layers retry the same call.
- **Metrics explosion:** unbounded labels overload telemetry.
- **Wrong order:** cache bypasses authorization.
- **Recursive proxy:** wrapper accidentally calls itself.

Test the composed stack, not only each wrapper. Draw one call path and one failure path with exact ordering.

## Practice

1. Add timing to an async loader while preserving its result and thrown error.
2. Write a cache key for tenant, locale, and product ID; explain every component.
3. Compose authorization, cache, and metrics in two orders. State how behavior differs.
4. Add retry with one deadline and jitter; prove an aborted call does not start another attempt.
`,
        vn: `
## Phân tích

Decorator và Proxy đều wrap contract tương thích rồi delegate, nhưng intent khác:

- **Decorator** thêm behavior có thể compose như metrics, cache, retry.
- **Proxy** kiểm soát access do location, cost, authorization hoặc lifecycle.

Wrapper phải giữ contract: success value, error category, cancellation và guarantee về timing. Nếu đổi semantics, phải document rõ.

## Yêu cầu

Xác định capability được wrap, wrapper có đổi result không, thứ tự với wrapper khác, owner của retry/cache/auth và behavior khi cancel.

Wrapper cần test độc lập, không chạm internal của delegate và phải giữ \`this\` binding nếu wrap method.

## Tính năng

Với product repository:

- Metrics Decorator đo duration/outcome.
- Cache Decorator phục vụ repeated read.
- Retry Decorator thử lại transient read.
- Authorization Proxy chặn access.
- Remote Proxy che network location.

Thứ tự có ý nghĩa: auth trước cache nếu data không public; metrics ngoài retry đo user latency, bên trong đo từng attempt.

## Công nghệ

- Higher-order function cho một operation.
- Object wrapper cho contract nhiều method.
- \`AbortSignal\` để truyền cancellation.
- Cache bounded với key và TTL rõ.
- Chỉ retry operation idempotent.

JavaScript \`Proxy\` native thường không cần; explicit wrapper dễ type và trace hơn.

## Thiết kế

Một thứ tự: \`authorize → measure → cache → retry → remote\`.

Kiểm tra tenant có nằm trong cache key, timeout budget có dùng chung, negative result có cache không và metrics có label cardinality thấp không.

Retry không được reset full timeout mỗi attempt.

## Code

\`\`\`js
export const withMetrics = (load, metrics) => async (id, options = {}) => {
  const started = performance.now();
  try {
    const value = await load(id, options);
    metrics.count('product_load', { outcome: 'ok' });
    return value;
  } catch (error) {
    metrics.count('product_load', { outcome: 'error' });
    throw error;
  } finally {
    metrics.timing('product_load_ms', performance.now() - started);
  }
};
\`\`\`

Metrics thêm behavior nhưng giữ result/error của delegate.

## Deploy

- Thêm từng wrapper một.
- Chạy contract test cho value và error.
- Bật metrics để lấy baseline.
- Roll out cache theo phần traffic.
- Bound retry và đo amplification.

Theo dõi hit rate, delegate latency, attempt và rejection.

## Trade-offs

Composition tránh subclass explosion nhưng tạo behavior phụ thuộc order và trace sâu. Cache giảm latency nhưng thêm stale data; retry tăng resilience nhưng tăng load; auth tập trung policy nhưng có thể thành network dependency ẩn.

Giữ stack ngắn; nếu cần mở sáu wrapper để hiểu một call, hãy gộp concern cohesive.

## Phân tích lỗi

- **Contract drift:** wrapper đổi missing semantics.
- **Mất cancellation:** không forward signal.
- **Cache leak:** key thiếu tenant.
- **Retry storm:** nhiều layer cùng retry.
- **Metrics explosion:** label không bounded.
- **Sai thứ tự:** cache bypass auth.
- **Recursive proxy:** wrapper gọi chính nó.

## Practice

1. Thêm timing cho async loader mà giữ nguyên error.
2. Thiết kế cache key tenant + locale + product.
3. So sánh hai order auth/cache/metrics.
4. Chứng minh abort không tạo retry mới.
`,
      },
    },
    {
      id: 'behavioral-strategy-observer',
      title: { en: 'Behavioral: Strategy / Observer', vn: 'Behavioral: Strategy / Observer' },
      baseline: {
        en: ['Understands callbacks and collections', 'Can model domain policy', 'Knows async delivery basics'],
        vn: ['Hiểu callback và collection', 'Mô hình hóa được domain policy', 'Biết async delivery cơ bản'],
      },
      skills: {
        en: ['Encapsulate policy with Strategy', 'Fan out notifications with Observer', 'Define event delivery semantics'],
        vn: ['Đóng gói policy bằng Strategy', 'Fan-out notification bằng Observer', 'Định nghĩa event delivery semantics'],
      },
      diagram: 'behavioral-strategy-observer',
      body: {
        en: `
## Analysis

Strategy and Observer address different kinds of variation:

- **Strategy** selects one interchangeable policy used to complete an operation.
- **Observer** notifies zero or more interested consumers after something happens.

Strategy is usually request/response and part of the main result. Observer is fan-out and raises delivery questions: sync or async, ordered or unordered, at-most-once or at-least-once.

Do not use events to hide required workflow steps. If charging must succeed before an order is accepted, payment is not an optional observer.

The deciding question is **who owns completion**. A Strategy is invoked because the current workflow needs its answer. An observer is notified because the producer has already completed its responsibility. If the producer waits for one particular subscriber to establish correctness, the relationship is a command or direct dependency in disguise.

## Requirements

A Strategy contract needs:

- Inputs in domain language.
- One clear result and error model.
- Behavioral examples shared by all policies.
- Selection ownership.
- No hidden mutation of global state.

An Observer mechanism needs:

- Event name, schema, and versioning rules.
- Delivery and ordering semantics.
- Failure isolation and retry ownership.
- Idempotency guidance for subscribers.
- Subscription lifecycle and leak prevention.

## Features

For shipping checkout:

- A Strategy calculates price for standard, express, or pickup.
- Checkout selects the policy from trusted configuration or request rules.
- After an order commits, observers update analytics, send confirmation, and schedule fulfillment.

The price affects the transaction, so it is synchronous Strategy work. Confirmation and analytics can happen after commit. Fulfillment may require durable messaging because losing it is unacceptable.

## Tech choices

- Use a function map for a closed set of stateless strategies.
- Use objects when strategies need dependencies or lifecycle.
- Use an in-process event target only for non-durable same-process notifications.
- Use a durable broker/outbox for cross-service business events.
- Validate event payloads at process boundaries.

An array of callbacks is not a durable event system. It loses events on crashes and cannot coordinate across replicas.

Keep event names in past tense and describe facts, such as \`OrderPlaced\`, rather than instructions such as \`SendEmail\`. Commands have an intended handler and may be rejected; events announce something that already happened and may have no consumers.

## Design

Strategy selection should be explicit and auditable. Reject unknown policy keys rather than silently defaulting, especially for money.

For observers:

1. Commit domain state.
2. Persist an event in the same transaction when durability matters.
3. Publish from the outbox.
4. Let subscribers deduplicate by event ID.
5. Record attempts and dead-letter terminal failures.

Define whether subscribers see events in aggregate order. Avoid event payloads that force consumers to query the producer immediately; include stable facts, but not sensitive data they do not need.

## Code

\`\`\`js
const shippingStrategies = {
  standard: ({ weightKg }) => 500 + Math.ceil(weightKg) * 80,
  express: ({ weightKg }) => 1200 + Math.ceil(weightKg) * 150,
  pickup: () => 0,
};

export function quoteShipping(method, parcel) {
  const calculate = shippingStrategies[method];
  if (!calculate) throw new Error('Unknown shipping method: ' + method);
  return calculate(parcel);
}

export function createEventBus() {
  const listeners = new Map();
  return {
    on(type, listener) {
      const set = listeners.get(type) ?? new Set();
      set.add(listener);
      listeners.set(type, set);
      return () => set.delete(listener);
    },
    emit(type, event) {
      return Promise.allSettled([...(listeners.get(type) ?? [])].map((fn) => fn(event)));
    },
  };
}
\`\`\`

The bus isolates failures but is intentionally non-durable.

## Deploy

- Add shared examples for every Strategy before changing selection.
- Log selected policy without sensitive input.
- Version durable event schemas compatibly.
- Deploy tolerant consumers before new producers.
- Measure subscriber lag, retries, duplicates, and dead letters.

For in-process observers, clean up subscriptions during teardown. For durable observers, rehearse replay and ensure side effects are idempotent.

## Trade-offs

Strategy removes growing conditionals and isolates policy, but can scatter a simple decision across files. A table may be enough for small formulas.

Observer decouples producer knowledge and enables fan-out, but makes control flow and consistency less immediate. Durable delivery adds infrastructure and duplicate handling. Synchronous observers keep flow local but allow one slow listener to delay the producer.

## Failure modes

- **Strategy mismatch:** implementations use different units or rounding.
- **Silent fallback:** unknown keys choose the wrong money policy.
- **Event as command:** producer expects exactly one subscriber to perform required work.
- **Ghost listener:** missing unsubscribe leaks memory and duplicate effects.
- **Unhandled observer failure:** rejection disappears.
- **Dual write:** state commits but event publish is lost.
- **Non-idempotent replay:** retry sends duplicate email or charge.

Use contract examples for policy and explicit delivery semantics for events. Apply the outbox pattern when state and event must survive together.

## Practice

1. Replace a shipping conditional with a function map; include rounding examples.
2. Test every Strategy against the same units and negative-input policy.
3. Implement subscribe/unsubscribe and prove teardown removes listeners.
4. Design an \`OrderPlaced\` event with ID, version, stable facts, and subscriber idempotency keys.
`,
        vn: `
## Phân tích

- **Strategy** chọn một policy thay thế được để hoàn thành operation.
- **Observer** thông báo cho zero hoặc nhiều consumer sau một sự kiện.

Strategy thường request/response và ảnh hưởng main result. Observer là fan-out với câu hỏi delivery: sync/async, ordered/unordered, at-most-once/at-least-once.

Không dùng event để che required step. Payment phải thành công thì không phải observer tùy chọn.

## Yêu cầu

Strategy cần domain input, result/error rõ, shared examples và owner chọn policy. Observer cần event schema/version, delivery semantics, failure isolation, idempotency và subscription lifecycle.

Không để cả hai pattern mutate global state ẩn.

## Tính năng

Trong checkout:

- Strategy tính giá standard, express hoặc pickup.
- Checkout chọn policy theo trusted rule.
- Sau commit, observer làm analytics, confirmation và fulfillment.

Giá ảnh hưởng transaction nên chạy sync. Analytics có thể sau commit; fulfillment cần durable message vì không được mất.

## Công nghệ

- Function map cho tập strategy đóng, stateless.
- Object khi strategy có dependency/lifecycle.
- In-process event cho notification không cần durable.
- Broker/outbox cho business event cross-service.
- Validate payload tại process boundary.

Array callback không phải durable event system.

## Thiết kế

Reject unknown strategy key thay vì fallback âm thầm. Với observer durable:

1. Commit domain state.
2. Persist event cùng transaction.
3. Publish từ outbox.
4. Subscriber deduplicate theo event ID.
5. Ghi attempt và dead letter.

Event gồm stable fact cần thiết, không chứa sensitive data dư thừa.

## Code

\`\`\`js
const shippingStrategies = {
  standard: ({ weightKg }) => 500 + Math.ceil(weightKg) * 80,
  express: ({ weightKg }) => 1200 + Math.ceil(weightKg) * 150,
  pickup: () => 0,
};

export function quoteShipping(method, parcel) {
  const calculate = shippingStrategies[method];
  if (!calculate) throw new Error('Unknown shipping method: ' + method);
  return calculate(parcel);
}
\`\`\`

Contract examples phải kiểm tra unit, rounding và invalid input.

## Deploy

- Pin shared examples.
- Log selected policy an toàn.
- Version schema tương thích.
- Deploy tolerant consumer trước producer mới.
- Đo lag, retry, duplicate và dead letter.

In-process observer phải unsubscribe khi teardown; durable observer phải replay an toàn.

## Trade-offs

Strategy cô lập policy nhưng có thể phân tán decision đơn giản. Observer giảm producer coupling nhưng control flow và consistency khó thấy hơn. Durable delivery thêm infrastructure và duplicate handling; sync observer có thể làm chậm producer.

## Phân tích lỗi

- **Strategy mismatch:** khác unit/rounding.
- **Silent fallback:** chọn sai policy tiền.
- **Event như command:** required work phụ thuộc một subscriber.
- **Ghost listener:** không unsubscribe.
- **Observer failure bị mất.**
- **Dual write:** state commit nhưng event mất.
- **Replay không idempotent.**

## Practice

1. Đổi shipping conditional thành function map.
2. Chạy shared test cho mọi policy.
3. Test unsubscribe loại listener.
4. Thiết kế \`OrderPlaced\` có ID, version và idempotency key.
`,
      },
    },
    {
      id: 'behavioral-command-template',
      title: { en: 'Behavioral: Command / Template Method', vn: 'Behavioral: Command / Template Method' },
      baseline: {
        en: ['Understands first-class functions and inheritance', 'Can separate policy from workflow', 'Knows queue and retry basics'],
        vn: ['Hiểu first-class function và inheritance', 'Tách được policy khỏi workflow', 'Biết queue và retry cơ bản'],
      },
      skills: {
        en: ['Represent actions as commands', 'Stabilize workflow skeletons', 'Choose composition or inheritance deliberately'],
        vn: ['Biểu diễn action thành command', 'Ổn định workflow skeleton', 'Chọn composition hoặc inheritance có chủ đích'],
      },
      diagram: 'behavioral-command-template',
      body: {
        en: `
## Analysis

Command and Template Method stabilize different dimensions:

- A **Command** represents an action as data plus executable behavior, enabling queues, retries, audit, or undo.
- A **Template Method** fixes a workflow skeleton while subclasses customize selected steps.

JavaScript often replaces Template Method inheritance with a **workflow function plus injected hooks**. Composition makes required steps visible and avoids protected-method coupling.

Use Command only when an action needs identity or lifecycle beyond a direct function call.

Commands are valuable when work must be stored, scheduled, retried, rate-limited, or audited independently from the caller. If none of those apply, an ordinary function call is clearer. Turning every method invocation into a command only relocates control flow into dispatch tables.

The extra lifecycle should solve an observed delivery or coordination problem, not merely make an action sound architectural.

## Requirements

A queued Command needs:

- A stable type and versioned payload.
- Validation before enqueue and before execution.
- An idempotency key.
- Retry and timeout policy.
- Observable status and terminal failure handling.
- No unserializable closures or live objects.

A workflow template needs:

- Fixed ordering and invariant steps.
- Explicit extension points.
- Rules for hook failure and cleanup.
- A result contract shared across variants.
- Few enough variants to understand.

## Features

For report generation:

- A \`GenerateReport\` Command stores report ID, format, actor, and request ID.
- A worker validates, authorizes, loads data, renders, stores, and records completion.
- Rendering is a variable step.
- Authorization, status transitions, and cleanup are invariant.

The queue gives temporal decoupling and retry. The workflow function gives a stable skeleton. A Factory can choose the renderer at the worker’s composition root.

## Tech choices

- Use plain serializable command envelopes.
- Keep handlers in a registry keyed by a closed command type.
- Store large inputs externally and reference them by ID.
- Use composition hooks before inheritance.
- Use \`try/finally\` for mandatory cleanup.

Do not serialize functions, class instances, or vendor clients into queue payloads. Payloads must survive deployment and language/runtime changes.

Keep payloads small but self-explanatory. Referencing a mutable record by ID means execution observes current state, while embedding a snapshot means execution observes request-time state. Choose deliberately and include a version or timestamp when that distinction affects correctness.

## Design

Command envelope:

- \`id\`: unique execution identity.
- \`type\` and \`version\`: dispatch and migration.
- \`idempotencyKey\`: duplicate protection.
- \`occurredAt\` or \`requestedAt\`: audit.
- \`payload\`: minimal stable input.

Handler flow:

1. Parse and validate.
2. Claim idempotency key.
3. Execute within a deadline.
4. Record success or classified failure.
5. Retry only transient failures.

For the workflow template, inject the variable renderer and storage capability. Keep required steps in one readable function.

## Code

\`\`\`js
export async function runReportWorkflow(command, deps) {
  const { authorize, loadRows, render, store, status } = deps;
  await status.start(command.id);
  try {
    await authorize(command.payload.actorId, command.payload.reportId);
    const rows = await loadRows(command.payload.reportId);
    const document = await render(rows, command.payload.format);
    const location = await store(document, { signal: deps.signal });
    await status.succeed(command.id, location);
    return location;
  } catch (error) {
    await status.fail(command.id, classify(error));
    throw error;
  } finally {
    await deps.cleanup?.(command.id);
  }
}

export const handlers = {
  'report.generate.v1': (command, deps) => runReportWorkflow(command, deps),
};
\`\`\`

The command is data; the handler owns execution; the workflow function is the template.

## Deploy

- Deploy handlers that accept old and new payload versions before producers switch.
- Enqueue a canary command.
- Observe queue age, execution duration, retries, and dead letters.
- Stop old producers, drain old messages, then remove old handlers.
- Rehearse redrive with idempotency protection.

For synchronous templates, roll out one variant and compare invariant status transitions. Never retry blindly after an unknown partial side effect.

## Trade-offs

Command enables scheduling, auditing, and isolation, but introduces queue latency, serialization constraints, duplicate delivery, and status storage.

Template Method inheritance can make the skeleton obvious, but subclass hooks create fragile coupling and are hard to combine. Composition is more explicit and testable, though it requires passing dependencies.

Undo is not automatic. It needs a compensating action and stored prior state; many external side effects cannot be perfectly reversed.

## Failure modes

- **Fat command:** payload embeds a full domain object that becomes stale.
- **Non-idempotent retry:** duplicate messages repeat side effects.
- **Poison message:** permanent invalid input retries forever.
- **Version break:** new worker cannot parse queued old commands.
- **Hook explosion:** every workflow step becomes optional.
- **Subclass surprise:** an override skips validation or cleanup.
- **Status lie:** command reports failed after side effect succeeded.

Use explicit state transitions and classify ambiguous outcomes for reconciliation.

## Practice

1. Design a serializable \`SendInvoice\` command with version and idempotency key.
2. Split failures into retryable, permanent, and ambiguous.
3. Implement one workflow with injected hooks, then compare it with subclass overrides.
4. Simulate duplicate delivery and prove the external side effect happens once.
`,
        vn: `
## Phân tích

- **Command** biểu diễn action thành data + executable behavior để queue, retry, audit hoặc undo.
- **Template Method** cố định workflow skeleton và cho subclass tùy biến vài bước.

Trong JavaScript, workflow function với injected hook thường đơn giản hơn inheritance. Chỉ dùng Command khi action cần identity/lifecycle vượt quá function call trực tiếp.

## Yêu cầu

Queued Command cần type ổn định, payload versioned, validation, idempotency key, retry/timeout, status và terminal failure handling. Payload không chứa closure hay live object.

Workflow template cần ordering cố định, extension point explicit, rule khi hook fail và result contract chung.

## Tính năng

Với report generation:

- Command giữ report ID, format, actor và request ID.
- Worker authorize, load, render, store và update status.
- Rendering là bước thay đổi.
- Status transition và cleanup là invariant.

Queue tách thời gian; workflow function giữ skeleton; Factory chọn renderer ở composition root.

## Công nghệ

- Command envelope là plain serializable data.
- Handler registry theo closed command type.
- Input lớn lưu ngoài, payload chỉ giữ ID.
- Ưu tiên composition hook.
- \`try/finally\` cho cleanup bắt buộc.

Không serialize function, class instance hoặc vendor client.

## Thiết kế

Envelope có \`id\`, \`type\`, \`version\`, \`idempotencyKey\`, \`requestedAt\` và payload tối thiểu.

Handler validate, claim key, execute trong deadline, record outcome và chỉ retry transient failure. Template inject renderer/storage nhưng giữ required steps trong một function.

## Code

\`\`\`js
export async function runReportWorkflow(command, deps) {
  await deps.status.start(command.id);
  try {
    await deps.authorize(command.payload.actorId, command.payload.reportId);
    const rows = await deps.loadRows(command.payload.reportId);
    const document = await deps.render(rows, command.payload.format);
    const location = await deps.store(document, { signal: deps.signal });
    await deps.status.succeed(command.id, location);
    return location;
  } catch (error) {
    await deps.status.fail(command.id, classify(error));
    throw error;
  } finally {
    await deps.cleanup?.(command.id);
  }
}
\`\`\`

Command là data; handler execute; workflow function là template.

## Deploy

- Deploy consumer đọc được old/new version trước.
- Enqueue canary.
- Đo queue age, duration, retry, dead letter.
- Dừng producer cũ và drain message.
- Rehearse redrive với idempotency.

Không retry mù sau side effect có outcome không rõ.

## Trade-offs

Command cho scheduling và audit nhưng thêm latency, serialization, duplicate delivery và status storage. Template inheritance làm skeleton rõ nhưng hook coupling khó compose; function composition explicit hơn nhưng cần truyền dependency.

Undo cần compensating action và prior state, không tự xuất hiện từ pattern.

## Phân tích lỗi

- **Fat command:** embed domain object dễ stale.
- **Retry không idempotent.**
- **Poison message:** invalid input retry mãi.
- **Version break:** worker mới không đọc command cũ.
- **Hook explosion:** mọi bước thành optional.
- **Subclass surprise:** override bỏ validation.
- **Status lie:** side effect thành công nhưng status fail.

## Practice

1. Thiết kế \`SendInvoice\` command versioned.
2. Chia failure thành retryable/permanent/ambiguous.
3. So sánh hook composition với subclass.
4. Test duplicate delivery chỉ gây side effect một lần.
`,
      },
    },
    {
      id: 'combining-patterns',
      title: { en: 'Combining patterns in a real feature', vn: 'Kết hợp pattern trong tính năng thực tế' },
      baseline: {
        en: ['Can identify pattern intent', 'Understands transactions and external boundaries', 'Can write contract tests'],
        vn: ['Nhận diện được pattern intent', 'Hiểu transaction và external boundary', 'Viết được contract test'],
      },
      skills: {
        en: ['Assign one pressure per pattern', 'Compose patterns at clear boundaries', 'Keep the core workflow readable'],
        vn: ['Gán một áp lực cho mỗi pattern', 'Compose pattern tại boundary rõ', 'Giữ core workflow dễ đọc'],
      },
      diagram: 'combining-patterns',
      body: {
        en: `
## Analysis

Real features often contain several pressures, but that does not justify stacking every familiar pattern. Assign **one demonstrated pressure to each pattern** and keep the core workflow readable.

Consider subscription renewal:

- Pricing varies by plan and region.
- Payment vendors expose incompatible APIs.
- External calls need metrics and bounded retry.
- Successful renewal notifies several downstream capabilities.
- Composition differs by deployment environment.

These pressures suggest Strategy, Adapter, Decorator, Observer/outbox, and Factory. Each has a job; none is decoration.

Composition must still read as one feature, not a catalog demonstration. Pattern boundaries should align with business or operational ownership. A pricing team can own policies, an integration team can own provider translation, and the subscription team can own the renewal sequence.

## Requirements

The renewal feature must:

- Produce the same monetary result for the same inputs.
- Charge at most once per renewal attempt.
- Persist subscription state and durable events atomically.
- Map vendor outcomes into stable domain outcomes.
- Be traceable by renewal ID without leaking payment data.
- Allow one provider migration without rewriting pricing.

Non-goals matter: no runtime plugin marketplace, no generic workflow engine, and no global service locator.

## Features

Pattern assignment:

- **Strategy:** calculate renewal amount.
- **Adapter:** translate a payment provider.
- **Decorator:** add metrics and retry to safe provider operations.
- **Factory:** select and wire the configured provider at startup.
- **Observer via outbox:** fan out \`SubscriptionRenewed\` after commit.
- **Facade/workflow function:** present one renewal use case to callers.

The transaction boundary remains explicit. Payment cannot be rolled back by a database transaction, so idempotency and reconciliation are first-class.

## Tech choices

- Use integer minor currency units.
- Use a plain function for pricing Strategy.
- Use a narrow \`charge(request)\` payment port.
- Use database uniqueness for idempotency claims.
- Use an outbox table for durable events.
- Use structured logs and low-cardinality metrics.

Do not retry ambiguous charge failures automatically unless the vendor honors the same idempotency key. A timeout may mean the charge succeeded.

## Design

Flow:

1. Load subscription and derive a renewal ID.
2. Calculate amount with the selected pricing Strategy.
3. Claim renewal ID in the database.
4. Charge through the provider Adapter using that ID.
5. In one local transaction, update subscription and append outbox event.
6. Publish event asynchronously.
7. Reconcile ambiguous provider outcomes.

Composition builds the graph once. The workflow receives ready capabilities and does not call factories or registries.

Define failure ownership: validation fails permanently; provider unavailable is retryable before a known charge; ambiguous charge enters reconciliation; database failure after charge triggers repair, not blind recharge.

## Code

\`\`\`js
export async function renewSubscription(subscriptionId, deps) {
  const subscription = await deps.subscriptions.get(subscriptionId);
  const renewalId = subscription.id + ':' + subscription.periodEnd;
  const amount = deps.price(subscription);

  if (!await deps.renewals.claim(renewalId)) {
    return deps.renewals.getResult(renewalId);
  }

  const payment = await deps.charge({
    idempotencyKey: renewalId,
    customerId: subscription.customerId,
    amount,
    currency: subscription.currency,
  });

  return deps.transaction(async (tx) => {
    const renewed = await tx.subscriptions.advance(subscription.id, payment.id);
    await tx.outbox.append({
      id: crypto.randomUUID(),
      type: 'SubscriptionRenewed.v1',
      aggregateId: subscription.id,
      data: { renewalId, periodEnd: renewed.periodEnd },
    });
    return renewed;
  });
}
\`\`\`

The function exposes ordering and critical boundaries without pattern names in the control flow.

## Deploy

- Shadow the new pricing Strategy and compare amounts without charging.
- Verify Adapter behavior in the provider sandbox.
- Enable new composition for a small tenant cohort.
- Monitor duplicate claims, ambiguous charges, outbox lag, and reconciliation age.
- Keep provider routing reversible until settlement comparison passes.

Deploy consumers before emitting a new event version. Redact customer and payment identifiers in logs.

## Trade-offs

Combining patterns localizes changes and makes ownership explicit. It also multiplies contracts, composition, and failure interactions.

The outbox improves durability but adds eventual consistency. Provider abstraction helps migration but can hide unique vendor capabilities. Retry improves transient success only when idempotency is strong. A Factory centralizes wiring but can obscure configuration if called at runtime.

Keep unique provider features available behind an explicit capability rather than weakening the common contract.

Evaluate the combination as a whole. A locally correct retry decorator may be globally unsafe after a charge, and an elegant event boundary may violate a user-visible consistency requirement. End-to-end invariants take priority over pattern purity.

## Failure modes

- **Pattern soup:** layers exist without one named pressure each.
- **Hidden transaction:** a facade implies atomicity across database and vendor.
- **Shared retry:** workflow and adapter both retry charges.
- **Weak idempotency:** key changes between attempts.
- **Event-before-commit:** consumers observe state that later rolls back.
- **Generic lowest denominator:** adapter discards provider information needed for reconciliation.
- **Unreadable composition:** runtime graph cannot be inspected.

Review the end-to-end trace after composing patterns. Local elegance cannot compensate for an unsafe global sequence.

## Practice

1. Draw the renewal success path and three failure paths: decline, timeout, database failure after charge.
2. Label each boundary with its pattern and one pressure. Remove any label without evidence.
3. Write a contract test shared by two payment adapters.
4. Design reconciliation for an ambiguous charge using the same renewal ID.
`,
        vn: `
## Phân tích

Feature thật có nhiều áp lực nhưng không cần xếp mọi pattern đã biết. Gán **một áp lực có bằng chứng cho mỗi pattern**.

Trong subscription renewal: pricing thay đổi theo plan/region; vendor payment khác API; external call cần metrics/retry; thành công cần fan-out; wiring khác theo environment.

Các áp lực này có thể cần Strategy, Adapter, Decorator, outbox Observer và Factory.

## Yêu cầu

- Kết quả tiền deterministic.
- Charge tối đa một lần mỗi renewal attempt.
- Persist state và durable event atomically.
- Map vendor outcome ổn định.
- Trace theo renewal ID nhưng không leak payment data.
- Migrate provider mà không sửa pricing.

Không xây plugin marketplace, generic workflow engine hay global locator.

## Tính năng

- **Strategy:** tính amount.
- **Adapter:** dịch payment provider.
- **Decorator:** metrics/retry cho operation an toàn.
- **Factory:** wire provider khi startup.
- **Outbox Observer:** fan-out sau commit.
- **Workflow Facade:** một renewal use case.

Payment không rollback cùng DB; idempotency và reconciliation là first-class.

## Công nghệ

Dùng integer minor unit, function Strategy, port \`charge\` hẹp, DB uniqueness cho idempotency, outbox table và structured log.

Không retry timeout charge nếu vendor không đảm bảo cùng idempotency key; timeout có thể đã charge.

## Thiết kế

1. Load subscription và tạo renewal ID.
2. Tính amount.
3. Claim ID trong DB.
4. Charge qua Adapter.
5. Update subscription + append outbox trong local transaction.
6. Publish async.
7. Reconcile outcome ambiguous.

Composition build graph một lần. Workflow không gọi factory. Validation là permanent; unavailable có thể retry trước known charge; ambiguous charge đi reconciliation.

## Code

\`\`\`js
export async function renewSubscription(subscriptionId, deps) {
  const subscription = await deps.subscriptions.get(subscriptionId);
  const renewalId = subscription.id + ':' + subscription.periodEnd;
  const amount = deps.price(subscription);

  if (!await deps.renewals.claim(renewalId)) {
    return deps.renewals.getResult(renewalId);
  }

  const payment = await deps.charge({
    idempotencyKey: renewalId,
    customerId: subscription.customerId,
    amount,
    currency: subscription.currency,
  });

  return deps.transaction(async (tx) => {
    const renewed = await tx.subscriptions.advance(subscription.id, payment.id);
    await tx.outbox.append({ type: 'SubscriptionRenewed.v1', aggregateId: subscription.id });
    return renewed;
  });
}
\`\`\`

Control flow cho thấy ordering mà không cần nhồi tên pattern.

## Deploy

- Shadow pricing và so amount.
- Test Adapter trong sandbox.
- Enable cho cohort nhỏ.
- Theo dõi duplicate claim, ambiguous charge, outbox lag.
- Giữ routing reversible đến khi settlement khớp.

Deploy consumer trước event version mới.

## Trade-offs

Pattern kết hợp giúp localize change nhưng tăng contract và failure interaction. Outbox bền hơn nhưng eventual consistency; abstraction provider có thể che capability riêng; retry chỉ an toàn với idempotency mạnh.

## Phân tích lỗi

- **Pattern soup:** layer không có áp lực riêng.
- **Transaction ẩn:** ngụ ý atomicity cross-system.
- **Double retry.**
- **Idempotency yếu:** key đổi giữa attempt.
- **Event trước commit.**
- **Lowest denominator:** mất data reconciliation.
- **Composition khó đọc.**

## Practice

1. Vẽ success và ba failure path.
2. Gắn mỗi pattern với một áp lực.
3. Viết shared contract test cho hai adapter.
4. Thiết kế reconciliation bằng renewal ID.
`,
      },
    },
    {
      id: 'patterns-capstone',
      title: { en: 'Capstone checklist', vn: 'Checklist capstone' },
      baseline: {
        en: ['Completed the preceding pattern lessons', 'Can trace an end-to-end feature', 'Can evaluate tests and operational behavior'],
        vn: ['Đã hoàn thành các bài pattern trước', 'Trace được feature end-to-end', 'Đánh giá được test và operational behavior'],
      },
      skills: {
        en: ['Run an evidence-based pattern review', 'Document forces and consequences', 'Deliver a reversible design'],
        vn: ['Thực hiện pattern review dựa bằng chứng', 'Ghi chép lực và hệ quả', 'Tạo thiết kế có thể đảo ngược'],
      },
      diagram: 'patterns-capstone',
      body: {
        en: `
## Analysis

The capstone is a **design review and delivery exercise**, not a pattern-counting contest. Choose one end-to-end feature with real variation, an external boundary, and at least one meaningful failure path.

Begin with evidence:

- Recent changes that touched the feature.
- Incidents, support cases, or flaky tests.
- Current dependency and ownership boundaries.
- One success trace and several failure traces.
- Operational constraints such as latency, durability, and rollout safety.

Write the problem without pattern names first. This prevents a preferred pattern from inventing its own requirement.

## Requirements

Your submission must include:

1. A context and force statement.
2. Current and proposed responsibility maps.
3. Explicit contracts with behavioral examples.
4. A readable core workflow.
5. Failure classification and ownership.
6. Test strategy by boundary.
7. Deployment, rollback, and observability plan.
8. Trade-offs and deletion criteria.

Keep scope narrow enough to implement. State non-goals. Every pattern must point to evidence and every new abstraction must have a caller.

## Features

Select a feature such as invoice delivery, order fulfillment, media processing, or report export. It should demonstrate:

- One variable policy suitable for Strategy or direct data.
- One external integration suitable for Adapter.
- One creation decision at the composition root.
- Optional cross-cutting behavior that may use Decorator.
- A deliberate decision about synchronous calls versus events.

You do not have to use all five. Rejecting an unnecessary pattern with clear reasoning is part of the exercise.

## Tech choices

Record choices in a short decision table:

- **Need:** the pressure being addressed.
- **Options:** direct code, pattern, or platform feature.
- **Choice:** smallest option that meets current requirements.
- **Evidence:** changes, tests, measurements, or incidents.
- **Revisit when:** a concrete threshold or new variant appears.

Use language-native functions and modules when sufficient. Add infrastructure only for durability, scale, or isolation requirements that the process cannot meet.

## Design

Produce two diagrams: a static responsibility map and a runtime sequence. Keep them honest about network and transaction boundaries.

For each contract, specify:

- Inputs, outputs, and units.
- Success, empty, and invalid cases.
- Timeout and cancellation.
- Idempotency and retry ownership.
- Security and tenant scope.
- Observability fields.

Then walk the design in review. If a reviewer cannot locate creation, policy, side effects, and error translation, simplify before implementation.

## Code

Build one thin vertical slice:

\`\`\`js
export function createInvoiceDelivery(config, clients) {
  const render = createRenderer(config.format);
  const send = withMetrics(
    createMailAdapter(clients.mail, config.sender),
    clients.metrics,
  );

  return async function deliverInvoice(request) {
    await clients.authorize(request.actorId, request.invoiceId);
    const invoice = await clients.invoices.get(request.invoiceId);
    const document = await render(invoice);
    return send({
      idempotencyKey: request.deliveryId,
      to: invoice.customerEmail,
      attachment: document,
    });
  };
}
\`\`\`

This slice makes composition, stable workflow, variable rendering, external translation, and metrics visible. Add durable Command or Observer behavior only if delivery must outlive the request.

## Deploy

Create a staged checklist:

- Pin old behavior with characterization and contract tests.
- Introduce boundaries without changing output.
- Run sandbox integration tests.
- Shadow deterministic decisions where possible.
- Canary by tenant or percentage.
- Compare business and technical outcomes.
- Rehearse rollback and delayed-message handling.
- Remove old code and temporary flags.

Define stop conditions before rollout, such as duplicate effects, increased error rate, or output mismatch.

## Trade-offs

Score the proposal on:

- **Change isolation:** fewer unrelated edits.
- **Readability:** common path remains visible.
- **Behavioral safety:** contracts cover meaningful outcomes.
- **Operations:** failures are diagnosable and recoverable.
- **Reversibility:** boundaries can be removed or replaced.

Also list costs: files, runtime hops, configuration, test matrix, and on-call complexity. A design with more patterns but no measurable improvement should lose to direct code.

## Failure modes

Capstone reviews commonly reveal:

- **Solution-first analysis:** pattern names appear before forces.
- **Diagram fiction:** distributed calls look local and atomic.
- **Happy-path contracts:** timeout, cancellation, and duplicates are absent.
- **Unowned composition:** objects are constructed throughout feature code.
- **Unbounded extension:** registries and hooks lack current consumers.
- **Migration gap:** clean target design has no safe path from today.
- **No deletion:** flags and compatibility paths become permanent.

Treat each as a design defect. Revise the workflow, contract, or rollout before adding more structure.

## Practice

Deliver the capstone in four passes:

1. **Discover:** collect change evidence and write forces without pattern terms.
2. **Design:** compare direct and patterned options; choose the smallest justified boundaries.
3. **Verify:** run contract, integration, failure, and concurrency tests appropriate to the feature.
4. **Operate:** stage rollout, observe outcomes, rehearse recovery, and remove migration code.

Final review questions:

- Can every pattern be removed independently?
- Does each abstraction have at least one real caller and variation?
- Are money, identity, and tenant boundaries explicit?
- Can an on-call engineer trace one request without guessing?
- What evidence would make you simplify this design later?
`,
        vn: `
## Phân tích

Capstone là **bài design review và delivery**, không phải cuộc thi đếm pattern. Chọn một feature end-to-end có variation thật, external boundary và failure path có ý nghĩa.

Thu thập change history, incident, ownership, success/failure trace và constraint vận hành. Viết vấn đề không dùng tên pattern trước để tránh solution tự tạo requirement.

## Yêu cầu

Submission gồm:

1. Context và force statement.
2. Responsibility map hiện tại/đề xuất.
3. Contract với behavioral example.
4. Core workflow dễ đọc.
5. Failure classification.
6. Test strategy.
7. Deploy, rollback, observability.
8. Trade-off và deletion criteria.

Nêu non-goal. Mỗi abstraction phải có caller và mỗi pattern phải có evidence.

## Tính năng

Chọn invoice delivery, fulfillment, media processing hoặc report export. Feature nên có variable policy, external integration, creation decision, optional cross-cutting behavior và quyết định sync/event.

Không bắt buộc dùng tất cả. Từ chối pattern không cần thiết là một phần bài tập.

## Công nghệ

Decision table gồm **Need**, **Options**, **Choice**, **Evidence**, **Revisit when**. Chọn option nhỏ nhất đáp ứng requirement hiện tại.

Dùng function/module native khi đủ. Chỉ thêm infrastructure khi durability, scale hoặc isolation vượt khả năng một process.

## Thiết kế

Tạo responsibility map và runtime sequence, thể hiện đúng network/transaction boundary.

Mỗi contract ghi input/output/unit, success/empty/invalid, timeout/cancellation, idempotency/retry owner, tenant security và observability field.

Nếu reviewer không tìm được creation, policy, side effect và error translation, hãy đơn giản hóa.

## Code

\`\`\`js
export function createInvoiceDelivery(config, clients) {
  const render = createRenderer(config.format);
  const send = withMetrics(
    createMailAdapter(clients.mail, config.sender),
    clients.metrics,
  );

  return async function deliverInvoice(request) {
    await clients.authorize(request.actorId, request.invoiceId);
    const invoice = await clients.invoices.get(request.invoiceId);
    const document = await render(invoice);
    return send({
      idempotencyKey: request.deliveryId,
      to: invoice.customerEmail,
      attachment: document,
    });
  };
}
\`\`\`

Vertical slice làm rõ composition, workflow, rendering policy, adapter và metrics.

## Deploy

- Pin old behavior.
- Introduce boundary không đổi output.
- Test sandbox.
- Shadow deterministic decision.
- Canary theo tenant/percentage.
- So business và technical outcome.
- Rehearse rollback.
- Xóa code cũ và temporary flag.

Định nghĩa stop condition trước rollout.

## Trade-offs

Đánh giá change isolation, readability, behavioral safety, operations và reversibility. Liệt kê chi phí: file, runtime hop, config, test matrix và on-call complexity.

Thiết kế nhiều pattern hơn nhưng không cải thiện đo được phải thua direct code.

## Phân tích lỗi

- **Solution-first:** pattern xuất hiện trước force.
- **Diagram fiction:** distributed call trông atomic.
- **Happy-path contract:** thiếu timeout/duplicate.
- **Composition vô chủ.**
- **Extension không bounded.**
- **Migration gap.**
- **Không có deletion:** flag sống mãi.

Sửa workflow, contract hoặc rollout trước khi thêm structure.

## Practice

1. **Discover:** thu evidence và viết force.
2. **Design:** so direct/patterned option.
3. **Verify:** contract, integration, failure, concurrency test.
4. **Operate:** rollout, observe, recover và xóa migration code.

Cuối cùng hỏi: mỗi pattern có xóa độc lập được không; abstraction có caller thật không; money/identity/tenant boundary có rõ không; on-call trace request được không?
`,
      },
    },
  ],
};
