/** @type {import('../catalog.js').Course} */
export const systemDesign = {
  id: 'system-design',
  title: { en: 'System Design', vn: 'Thiết kế hệ thống' },
  summary: {
    en: 'Design practical services by connecting requirements, scale, data, interfaces, failures, and operations to explicit product promises.',
    vn: 'Thiết kế service thực tế bằng cách nối yêu cầu, quy mô, dữ liệu, interface, failure và operations với lời hứa sản phẩm rõ ràng.',
  },
  sections: [
    {
      id: 'clarifying-requirements',
      title: { en: 'Clarifying requirements & constraints', vn: 'Làm rõ yêu cầu và ràng buộc' },
      baseline: {
        en: ['Separate functional requirements from quality attributes', 'Identify users, core journeys, and external dependencies', 'Turn vague words such as fast or reliable into questions'],
        vn: ['Tách functional requirement khỏi quality attribute', 'Xác định user, core journey và external dependency', 'Biến từ mơ hồ như nhanh hoặc tin cậy thành câu hỏi'],
      },
      skills: {
        en: ['Define measurable scope, SLOs, and non-goals', 'Surface product, legal, security, and operational constraints', 'Rank assumptions by architectural impact'],
        vn: ['Định nghĩa scope, SLO đo được và non-goal', 'Làm lộ constraint sản phẩm, pháp lý, security và operations', 'Xếp hạng assumption theo tác động architecture'],
      },
      diagram: 'clarifying-requirements',
      body: {
        en: `## Analysis

Start with the **product promise**, not a database or cloud diagram. Identify the actors, their main journeys, and the outcome each actor considers successful. A URL shortener, for example, serves link creators, redirect visitors, support staff, and abuse reviewers; each has different permissions and latency needs.

Separate statements into:

- **Facts**: legal residency, an existing identity provider, or a contractual recovery target.
- **Assumptions**: expected traffic, retention, or geographic distribution that still needs evidence.
- **Decisions**: a chosen availability target, storage model, or consistency rule.
- **Preferences**: familiar tools that may be changed without violating the product.

Rank uncertainty by architectural impact. If changing an estimate by ten times changes the design, validate it early.

## Requirements

Write functional requirements as observable behavior:

- Create, resolve, disable, expire, and inspect a short link.
- Define who may perform each action and whether anonymous access is allowed.
- State what an unknown, expired, disabled, or malicious link returns.
- Define whether destinations and custom aliases are mutable or reusable.

Then add measurable quality requirements. Replace “fast” with **p99 redirect latency under a named load**, and replace “reliable” with an availability percentage, population, and measurement window. State recovery objectives, retention, deletion deadlines, audit needs, privacy rules, and acceptable analytics delay.

Record non-goals explicitly. *Real-time analytics, arbitrary destination edits, per-click billing, and active-active writes* might be deferred from version one.

## Features

Prioritize features by journey and risk:

1. **Core**: create a generated link and redirect it.
2. **Safety**: disable abuse, validate destinations, and rate-limit creation.
3. **Management**: list, expire, or delete owned links.
4. **Optional**: custom aliases, campaign analytics, previews, and regional writes.

For each feature, name acceptance criteria and an owner. “Analytics” is incomplete; “campaign owners see hourly counts within 15 minutes, excluding known bots” is testable. Clarify whether counts are billing-grade or approximate because that choice changes event durability and reconciliation.

## Tech choices

Technology follows constraints. A relational database is a reasonable initial source of truth when uniqueness and management queries matter. A key-value store may fit a very large, simple redirect workload, but secondary queries and uniqueness workflows still need design. A cache is justified by read reuse and latency targets, not by fashion.

Create a short decision table:

| Decision | Requirement | Evidence needed |
|---|---|---|
| Single write region | Strong alias uniqueness | Regional latency estimate |
| Cache redirects | p99 under 50 ms | Hit-rate and origin benchmark |
| Async analytics | Redirect isolation | Approved freshness window |

## Design

Draw the smallest system that meets approved requirements:

- **Create API** validates identity, policy, URL, and alias.
- **Mapping store** owns the code-to-destination invariant.
- **Redirect service** performs a narrow lookup and returns HTTP redirect.
- **Cache** accelerates proven repeated reads.
- **Event pipeline** processes analytics away from the redirect path.

Label each synchronous arrow with a deadline and each asynchronous arrow with delivery semantics. Mark the source of truth, trust boundaries, and operator actions. Walk a normal request, duplicate create, cache miss, abuse revocation, and dependency timeout.

## Code

Capture requirements as data so reviewers can challenge them:

~~~json
{
  "journey": "redirect",
  "sli": "successful responses / valid requests",
  "target": "99.95% per rolling 30 days",
  "latency": "p99 < 50 ms at 12000 rps",
  "revocation": "disabled links stop within 10 seconds"
}
~~~

Keep unresolved values marked as assumptions with an owner and validation date. Do not silently turn a placeholder into a guarantee.

## Deploy

Treat rollout constraints as requirements. Define backward-compatible schema changes, canary population, rollback behavior, feature flags, and data repair. Ask whether old mobile or partner clients remain active during a release. Define who can change routing, retention, or abuse policy and how those control-plane changes are audited and reverted.

Before launch, verify the SLO with representative load, test a cache loss, and exercise link revocation. Launch limits should name traffic, tenant, or region boundaries rather than saying “gradual.”

## Trade-offs

Requirements compete:

- Lower redirect latency may require caching and therefore controlled staleness.
- Immediate global edits require coordination that can reduce availability.
- Strong analytics durability adds cost and coupling.
- Custom aliases improve usability but create contention, moderation, and namespace policy.

Document which product outcome wins during conflict. *“Prefer redirect availability over immediate analytics”* is useful; *“use eventual consistency”* alone is not.

## Failure modes

Common requirement failures include:

- A percentage without a population or time window.
- An average latency target that hides tail behavior.
- A feature without authorization, retention, or deletion semantics.
- A hidden dependency such as billing or abuse review.
- A current implementation mistaken for a permanent constraint.
- A non-goal that quietly returns during delivery.

For every major requirement, ask what the user sees when one dependency is slow, unavailable, stale, or duplicated. If the answer has product or security impact, a named owner must accept it.

## Practice

1. Write a URL-shortener brief with four functional requirements, four quality targets, three constraints, and three non-goals.
2. Create ten architecture-changing questions for a home-feed product owner. Provide a safe default for every unanswered question.
3. Replace “highly available checkout” with separate targets for browsing, order submission, payment confirmation, and operator recovery.
4. Map every proposed component to one approved requirement. Remove any component that has no requirement or demonstrated risk.`,
        vn: `## Phân tích

Bắt đầu bằng **lời hứa sản phẩm**, không bắt đầu bằng database hay cloud diagram. Xác định actor, journey chính và outcome mà từng actor xem là thành công. URL shortener phục vụ creator, visitor, support và abuse reviewer; mỗi nhóm có permission cùng latency khác nhau.

Tách thông tin thành:

- **Fact**: data residency, identity provider hiện có, recovery target theo hợp đồng.
- **Assumption**: traffic, retention, geographic distribution chưa được đo.
- **Decision**: availability target, storage model, consistency rule đã chọn.
- **Preference**: công cụ quen thuộc nhưng có thể thay.

Assumption nào thay đổi mười lần sẽ đổi architecture thì phải validate sớm.

## Yêu cầu

Viết functional requirement dưới dạng behavior quan sát được:

- Create, resolve, disable, expire và inspect short link.
- Nêu ai được thực hiện từng action.
- Định nghĩa response cho code missing, expired, disabled hoặc malicious.
- Chốt destination và custom alias có mutable hoặc reusable không.

Thay “nhanh” bằng **p99 latency dưới named load**; thay “ổn định” bằng availability có population và window. Ghi rõ RPO, RTO, retention, deletion deadline, privacy, audit và analytics delay. Liệt kê non-goal như real-time dashboard, arbitrary edit hoặc active-active write.

## Tính năng

Ưu tiên theo journey và risk:

1. **Core**: tạo generated link và redirect.
2. **Safety**: disable abuse, validate URL, rate-limit creation.
3. **Management**: list, expire, delete link của owner.
4. **Optional**: custom alias, campaign analytics, preview, regional write.

Mỗi feature cần acceptance criterion và owner. “Có analytics” chưa đủ; “hourly count xuất hiện trong 15 phút và loại known bot” mới test được.

## Công nghệ

Chọn technology sau constraint. Relational database là default hợp lý khi cần uniqueness và management query. Key-value store phù hợp workload lookup rất lớn nhưng secondary query và uniqueness vẫn phải được thiết kế. Cache chỉ hợp lý khi có read reuse và latency target.

| Decision | Requirement | Evidence |
|---|---|---|
| Single write region | Alias unique | Regional latency |
| Redirect cache | p99 dưới 50 ms | Hit-rate benchmark |
| Async analytics | Redirect độc lập | Freshness window |

## Thiết kế

Vẽ system nhỏ nhất:

- **Create API** validate identity, policy, URL và alias.
- **Mapping store** giữ invariant code-to-destination.
- **Redirect service** lookup rồi trả redirect.
- **Cache** giảm repeated read.
- **Event pipeline** xử lý analytics ngoài critical path.

Ghi deadline trên synchronous arrow, delivery semantic trên asynchronous arrow, source of truth và trust boundary. Walk happy path, duplicate create, cache miss, abuse revocation và timeout.

## Code

Biểu diễn requirement thành artifact review được:

~~~json
{
  "journey": "redirect",
  "sli": "successful responses / valid requests",
  "target": "99.95% trong 30 ngày",
  "latency": "p99 < 50 ms tại 12000 rps",
  "revocation": "disable có hiệu lực trong 10 giây"
}
~~~

Assumption chưa xác nhận phải có owner và ngày validate; không biến placeholder thành guarantee một cách âm thầm.

## Deploy

Định nghĩa compatible migration, canary population, rollback, feature flag và data repair. Hỏi old client nào còn hoạt động. Chốt ai được đổi routing, retention, abuse policy và cách audit hoặc revert control-plane change.

Trước launch, load test SLO, thử cache loss và diễn tập revocation. “Rollout dần” phải được thay bằng traffic, tenant hoặc region cụ thể.

## Trade-offs

- Latency thấp cần cache và chấp nhận staleness có giới hạn.
- Edit global tức thì cần coordination, có thể giảm availability.
- Durable analytics tăng cost và coupling.
- Custom alias tăng usability nhưng tạo contention và moderation.

Ghi product outcome nào thắng khi conflict. *Ưu tiên redirect availability hơn analytics tức thì* là decision rõ.

## Phân tích lỗi

Các lỗi phổ biến:

- Percentage thiếu population hoặc window.
- Average latency che tail.
- Feature thiếu authorization, retention hoặc deletion semantic.
- Hidden dependency như billing hay abuse review.
- Current implementation bị xem là permanent constraint.
- Non-goal quay lại mà không được review.

Với mỗi requirement, hỏi user thấy gì khi dependency slow, unavailable, stale hoặc duplicate.

## Practice

1. Viết brief URL shortener gồm bốn functional requirement, bốn quality target, ba constraint và ba non-goal.
2. Tạo mười câu hỏi làm đổi architecture cho home feed và default an toàn cho câu chưa trả lời.
3. Tách “checkout availability cao” thành target cho browse, submit, payment confirmation và recovery.
4. Map mỗi component tới requirement; bỏ component không có căn cứ.`,
      },
    },
    {
      id: 'capacity-latency-consistency',
      title: { en: 'Capacity, latency, consistency', vn: 'Capacity, latency và consistency' },
      baseline: {
        en: ['Estimate request rate, storage growth, and bandwidth', 'Understand percentiles and end-to-end latency budgets', 'Recognize consistency as a product-visible choice'],
        vn: ['Ước lượng request rate, storage growth và bandwidth', 'Hiểu percentile và end-to-end latency budget', 'Nhận ra consistency là lựa chọn user nhìn thấy'],
      },
      skills: {
        en: ['Build capacity estimates with sensitivity ranges', 'Allocate latency budgets across dependencies', 'Choose consistency per operation and invariant'],
        vn: ['Lập capacity estimate với sensitivity range', 'Phân bổ latency budget qua dependency', 'Chọn consistency theo operation và invariant'],
      },
      diagram: 'capacity-latency-consistency',
      body: {
        en: `## Analysis

Capacity, latency, and consistency answer three different questions: **Can the system carry the workload? Can it respond within the experience budget? Can users trust what they see?** They interact, so optimize them per journey rather than applying one label to the whole system.

Use ranges instead of false precision. Record low, expected, and high values for daily users, actions per user, bytes per item, peak factor, retention, and replication. Mark the assumptions that would change the architecture if wrong by ten times.

## Requirements

Define the workload per operation:

- Average and peak reads and writes per second.
- Read/write ratio, item size, response size, and retention.
- Geographic and tenant skew.
- Burst duration and peak-to-average factor.
- Required p50, p95, and p99 latency.
- Freshness, ordering, uniqueness, and read-after-write expectations.

Consistency must protect specific invariants. A feed rank may be stale for seconds, while a block or privacy change must prevent unauthorized access immediately. Distinguish **durability** from **visibility**: a committed event can be durable before a materialized view displays it.

## Features

For a personalized feed, analyze publish, fan-out, read, follow, block, delete, and ranking separately. Each operation has a different load shape and correctness requirement.

- Publishing may create large write fan-out.
- Reading is frequent and latency-sensitive.
- Following benefits from read-your-writes.
- Blocking is authorization-sensitive.
- Like counts may converge asynchronously.
- Deletion needs a bounded propagation and repair path.

A celebrity account is not an average account. Model high-fan-out users and viral items explicitly.

## Tech choices

Choose mechanisms from the workload:

- **Precomputed feeds** spend writes and storage to make reads cheap.
- **Read-time assembly** saves fan-out writes but increases read latency.
- **Hybrid fan-out** precomputes ordinary authors and assembles celebrity posts at read time.
- **Replicas** reduce read latency but may return stale state.
- **Coordination** protects narrow invariants but can reduce availability during partitions.

Do not call an entire database “strongly consistent” or “eventually consistent.” State the guarantee for each operation and the source that enforces it.

## Design

Start with dimensional analysis:

~~~text
average QPS = daily operations / 86,400
peak QPS = average QPS × credible peak factor
concurrency ≈ QPS × service time in seconds
storage = items × bytes × retention × replication/index factor
~~~

For 10 million daily users opening a feed 20 times, there are 200 million reads per day: about 2,315 average QPS. With a 5× peak, plan around 11,600 QPS before safety margin. Twenty 2 KB items at 12,000 QPS produce about 480 MB/s of raw response data before protocol overhead and compression.

Build a latency budget from the outside in. A 400 ms client target might allocate 80 ms network, 30 ms gateway, 120 ms feed lookup, 80 ms hydration and policy, 30 ms serialization, and 60 ms margin. Parallel calls consume the maximum branch time; sequential calls add.

## Code

Keep calculations reproducible:

~~~js
const dailyReads = 10_000_000 * 20;
const averageQps = dailyReads / 86_400;
const peakQps = averageQps * 5;
const rawBytesPerSecond = peakQps * 20 * 2_000;
~~~

Add units to every variable and table. Run sensitivity checks at 0.1×, 1×, and 10×. A spreadsheet is useful only when a changed number changes a decision.

## Deploy

Validate estimates with representative traffic, including realistic key skew and payload size. Ramp load until saturation, then record where queueing causes p99 latency to rise sharply. Test one-zone loss and a lagging replica.

Deploy consistency changes carefully. A new asynchronous projection may coexist with the old read path until counts, freshness, and authorization results match. Monitor lag in time and items, not only consumer throughput. Keep rollback compatible with both old and new data.

## Trade-offs

- More replication improves read capacity and resilience but increases cost and stale-read risk.
- Larger batches improve throughput but add waiting latency.
- More fan-out improves feed reads but amplifies celebrity writes.
- Stronger coordination protects correctness but costs latency and partition availability.
- Compression lowers bandwidth but consumes CPU and may not reduce in-memory size.

Spend complexity only where a measurable product target needs it.

## Failure modes

Watch for:

- Averages hiding bursts, skew, or queueing collapse.
- Missing replication, indexes, metadata, or backups in storage estimates.
- Unlimited concurrency exhausting connections before CPU.
- One hot partition while fleet-wide utilization appears low.
- Stale access-control data treated like stale ranking.
- Durable events mistaken for immediately visible state.
- Percentiles aggregated incorrectly across regions or time windows.

Define overload behavior: reject, shed optional work, serve stale data, reduce page size, or queue bounded work. Silent latency growth is not a strategy.

## Practice

1. Estimate QPS, egress, and one-year storage for a feed using low, expected, and high assumptions.
2. Create a 250 ms server budget for a request with four dependencies. Model one dependency taking twice its allocation.
3. Classify publish, follow, block, like count, ranking, and delete by required consistency.
4. Recalculate the design for a celebrity with 100 million followers and identify the first bottleneck.`,
        vn: `## Phân tích

Capacity, latency và consistency trả lời ba câu hỏi: **system có chịu được workload, có đáp ứng experience budget, và user có tin state nhìn thấy không?** Ba chiều tương tác nên phải phân tích theo journey, không gắn một label cho toàn hệ thống.

Dùng range thấp, expected và cao. Ghi daily users, action mỗi user, byte mỗi item, peak factor, retention và replication. Assumption sai mười lần làm đổi design cần được validate trước.

## Yêu cầu

Định nghĩa theo operation:

- Average và peak read/write mỗi giây.
- Read/write ratio, item size, response size, retention.
- Geographic, tenant và key skew.
- Burst duration, p50, p95, p99 latency.
- Freshness, ordering, uniqueness, read-after-write.

Consistency phải bảo vệ invariant cụ thể. Feed ranking có thể stale vài giây, nhưng block hay privacy change phải ngăn unauthorized read ngay. Tách **durability** khỏi **visibility**.

## Tính năng

Với personalized feed, phân tích publish, fan-out, read, follow, block, delete và ranking riêng:

- Publish tạo write fan-out.
- Read thường xuyên và latency-sensitive.
- Follow cần read-your-writes.
- Block liên quan authorization.
- Like count có thể converge.
- Delete cần propagation deadline và repair.

Celebrity account không phải average account; model hot author và viral item rõ ràng.

## Công nghệ

- **Precompute feed** đổi write và storage lấy cheap read.
- **Read-time assembly** giảm fan-out nhưng tăng read latency.
- **Hybrid** precompute author thường, merge celebrity khi read.
- **Replica** giảm latency nhưng có stale state.
- **Coordination** bảo vệ invariant nhưng giảm availability khi partition.

Nêu guarantee theo operation và source enforce nó; không gắn nhãn consistency chung chung cho database.

## Thiết kế

~~~text
average QPS = daily operations / 86.400
peak QPS = average QPS × peak factor
concurrency ≈ QPS × service time
storage = items × bytes × retention × replication/index
~~~

10 triệu daily user mở feed 20 lần tạo 200 triệu read/ngày, khoảng 2.315 average QPS. Peak 5× là gần 11.600 QPS. Hai mươi item 2 KB tại 12.000 QPS tạo khoảng 480 MB/s raw.

Lập latency budget từ client vào trong. Ví dụ target 400 ms gồm network, gateway, feed lookup, hydration, policy, serialization và margin. Sequential call cộng thời gian; parallel branch chịu branch chậm nhất.

## Code

~~~js
const dailyReads = 10_000_000 * 20;
const averageQps = dailyReads / 86_400;
const peakQps = averageQps * 5;
const rawBytesPerSecond = peakQps * 20 * 2_000;
~~~

Gắn unit vào mọi số và chạy sensitivity ở 0,1×, 1×, 10×. Calculation chỉ có giá trị nếu nó thay đổi decision.

## Deploy

Load test bằng payload và key skew thực. Tăng traffic tới saturation rồi ghi điểm queueing làm p99 tăng mạnh. Test zone loss và lagging replica.

Khi chuyển read path sang projection async, chạy song song old/new và so count, freshness, authorization. Monitor lag theo time lẫn item. Rollback phải đọc được data của cả version cũ và mới.

## Trade-offs

- Replication tăng capacity nhưng tốn cost và tạo stale-read risk.
- Batch lớn tăng throughput nhưng thêm waiting latency.
- Fan-out tăng read speed nhưng amplify celebrity write.
- Coordination tăng correctness nhưng tốn latency.
- Compression giảm bandwidth nhưng dùng CPU.

Chỉ mua complexity cho target sản phẩm đo được.

## Phân tích lỗi

- Average che burst, skew và queue collapse.
- Storage estimate quên replica, index, metadata, backup.
- Unlimited concurrency cạn connection trước CPU.
- Hot partition bị che bởi fleet average.
- Stale authorization bị xem như stale ranking.
- Durable event bị hiểu nhầm là visible ngay.
- Percentile bị aggregate sai giữa region hoặc window.

Định nghĩa overload behavior: reject, shed optional work, serve stale, giảm page size hoặc queue có bound.

## Practice

1. Ước lượng QPS, egress và storage một năm cho feed ở ba scenario.
2. Tạo latency budget 250 ms cho request có bốn dependency.
3. Phân loại consistency cho publish, follow, block, like, ranking, delete.
4. Tính lại khi celebrity có 100 triệu follower và tìm bottleneck đầu tiên.`,
      },
    },
    {
      id: 'data-modeling-storage',
      title: { en: 'Data modeling & storage choice', vn: 'Mô hình dữ liệu và lựa chọn storage' },
      baseline: {
        en: ['Model entities, relationships, and access patterns', 'Understand indexes, transactions, and replication basics', 'Distinguish source-of-truth data from derived views'],
        vn: ['Mô hình entity, relationship và access pattern', 'Hiểu index, transaction và replication cơ bản', 'Tách source-of-truth data khỏi derived view'],
      },
      skills: {
        en: ['Choose storage from invariants and query patterns', 'Design keys, indexes, partitions, and retention together', 'Plan schema evolution and repairable derived data'],
        vn: ['Chọn storage từ invariant và query pattern', 'Thiết kế key, index, partition và retention cùng nhau', 'Lập kế hoạch schema evolution và derived data có thể repair'],
      },
      diagram: 'data-modeling-storage',
      body: {
        en: `## Analysis

Choose storage from **invariants and access patterns**, not from a product category or trend. Start by listing entities, stable identifiers, ownership, lifecycle states, and legal transitions. Then list every required read and write with key, filters, sort order, cardinality, frequency, freshness, and consistency.

For checkout, the hard questions concern money, order identity, and inventory. Search, email, analytics, and dashboards are derived needs. One database does not need to serve every shape, but one system must remain the source of truth.

Write the model in domain language first. Physical schemas should implement that model, not quietly redefine it around a storage product’s limitations.

## Requirements

State invariants before schemas:

- One idempotent checkout creates at most one order.
- A provider payment reference belongs to one payment attempt.
- Money uses integer minor units plus currency.
- Inventory never commits below zero.
- Order state follows explicit legal transitions.
- Personal and financial data follow separate retention rules.

Specify expected write volume, read queries, transaction size, growth, delete rate, and restore requirements. Identify which reads tolerate replica lag and which must observe the latest committed state.

## Features

Model core entities such as **Customer, Cart, CheckoutAttempt, Order, OrderLine, PaymentAttempt, Reservation**, and OutboxEvent. Avoid turning every noun into a table without behavior.

Define common queries before indexes:

- Fetch an order by ID and owner.
- List recent orders by customer.
- Find pending payment attempts for reconciliation.
- Claim expiring inventory reservations.
- Retrieve fulfillment work by status.

Search and analytics can consume committed events into rebuildable projections. They must not silently become authoritative.

## Tech choices

A relational database is often the simplest checkout source of truth because transactions, foreign keys, and unique constraints make critical invariants direct. A document store fits aggregate reads when cross-document invariants are limited. A wide-column or key-value store fits huge predictable key access, but secondary access and transactions need explicit solutions.

Choose IDs deliberately. Sequential IDs improve locality but reveal volume and can concentrate writes. Random IDs distribute writes but use larger indexes and reduce locality. Time-sortable random IDs are a compromise, *not a substitute for partition analysis*.

## Design

Keep the authoritative transaction small:

1. Validate request and lock or conditionally update required rows.
2. Create or reuse CheckoutAttempt by idempotency scope.
3. Create Order and reservation state.
4. Insert an outbox event in the same transaction.
5. Commit; publish derived work later.

Partition only after measured size, throughput, isolation, or maintenance requires it. Pick a key aligned with dominant access, and plan rebalancing. Customer-based partitioning helps order history but can create hot enterprise tenants; order-based hashing spreads load but complicates customer lists.

## Code

Use database constraints as executable invariants:

~~~sql
CREATE TABLE payment_attempts (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  provider_ref text,
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency char(3) NOT NULL,
  status text NOT NULL,
  UNIQUE (account_id, idempotency_key),
  UNIQUE (provider_ref)
);

UPDATE inventory
SET available = available - :qty
WHERE sku = :sku AND available >= :qty;
~~~

The affected-row count decides whether reservation succeeded. A prior application read followed by an unconditional write is race-prone.

## Deploy

Use expand-and-contract migrations:

- Add nullable columns or new tables first.
- Deploy code that writes old and new representations when necessary.
- Backfill in bounded batches with checkpoints and rate limits.
- Compare results and switch reads gradually.
- Remove old fields only after all clients and rollback windows expire.

Monitor lock time, replica lag, query plans, index growth, and backfill errors. Test restore and reconciliation, not only backup creation.

## Trade-offs

- Normalization reduces duplicated truth but may require joins.
- Denormalization speeds known reads but creates synchronization and repair.
- More indexes improve reads while amplifying writes and storage.
- Strong transactions simplify invariants but constrain partitioning.
- Derived stores support incompatible queries but add lag and replay work.

Choose the simplest source that enforces the hardest invariant. Add specialized stores only for measured access patterns.

## Failure modes

Common failures are:

- Dual-writing database and broker without an outbox or reconciliation.
- Treating NoSQL as “schema-free.”
- Using a read replica for a read-after-write workflow.
- Missing uniqueness under concurrent requests.
- Hot products or tenants overwhelming one partition.
- Backfills taking long locks or competing with production traffic.
- Deleting authoritative data before derived copies and backups.
- Keeping a projection that cannot be rebuilt or repaired.

Every mutation should answer: *what happens if the process stops after this statement?*

## Practice

1. Model checkout entities and five invariants. Map each to a constraint, transaction, conditional write, or reconciliation.
2. Build an access-pattern table for order history, fulfillment, payment reconciliation, and analytics.
3. Design a zero-downtime migration from one address string to structured fields.
4. Compare customer-keyed and hash-keyed partitioning for one million orders per day.`,
        vn: `## Phân tích

Chọn storage từ **invariant và access pattern**, không từ trend. Liệt kê entity, stable identifier, owner, lifecycle state và legal transition. Sau đó ghi mỗi read/write với key, filter, sort, cardinality, frequency, freshness và consistency.

Với checkout, câu hỏi khó nằm ở money, order identity và inventory. Search, email, analytics, dashboard là derived need. Một database không cần phục vụ mọi query shape, nhưng phải có một source of truth rõ.

## Yêu cầu

Nêu invariant trước schema:

- Một idempotent checkout tạo tối đa một order.
- Provider payment reference chỉ thuộc một attempt.
- Money dùng integer minor unit kèm currency.
- Inventory không commit dưới zero.
- Order chỉ đi qua legal transition.
- Personal và financial data có retention riêng.

Ghi write volume, query, transaction size, growth, delete rate và restore target. Chỉ rõ read nào chịu replica lag.

## Tính năng

Model Customer, Cart, CheckoutAttempt, Order, OrderLine, PaymentAttempt, Reservation và OutboxEvent. Liệt kê query trước index: order by ID, recent orders by customer, pending payment để reconcile, expiring reservation và fulfillment theo status.

Search, email và analytics consume committed event vào projection rebuild được; chúng không trở thành authoritative.

## Công nghệ

Relational database thường là source of truth đơn giản nhất vì transaction, foreign key và unique constraint. Document store hợp aggregate read khi ít cross-document invariant. Key-value store hợp predictable key access rất lớn nhưng secondary access phải được giải quyết rõ.

Sequential ID tăng locality nhưng lộ volume; random ID phân tán write nhưng index lớn. Time-sortable random ID chỉ là compromise, *không thay partition analysis*.

## Thiết kế

Authoritative transaction:

1. Validate và conditional update state.
2. Create hoặc reuse CheckoutAttempt theo idempotency scope.
3. Create Order và reservation.
4. Insert outbox event cùng transaction.
5. Commit rồi publish derived work.

Chỉ partition khi size, throughput hoặc isolation đo được yêu cầu. Customer key giúp order history nhưng hot tenant; hash order key trải load nhưng list theo customer khó hơn.

## Code

~~~sql
CREATE TABLE payment_attempts (
  id uuid PRIMARY KEY,
  account_id uuid NOT NULL,
  idempotency_key text NOT NULL,
  provider_ref text UNIQUE,
  amount_minor bigint CHECK (amount_minor >= 0),
  currency char(3) NOT NULL,
  UNIQUE (account_id, idempotency_key)
);

UPDATE inventory
SET available = available - :qty
WHERE sku = :sku AND available >= :qty;
~~~

Affected-row count quyết định reservation; read rồi unconditional write có race.

## Deploy

Dùng expand-and-contract:

- Add nullable field hoặc table.
- Deploy writer tương thích old/new.
- Backfill bounded batch có checkpoint.
- Compare rồi shift read.
- Chỉ remove old field sau rollback window.

Monitor lock, replica lag, query plan, index growth và backfill error. Test restore cùng reconciliation.

## Trade-offs

- Normalization giảm duplicate truth nhưng cần join.
- Denormalization tăng read speed nhưng tạo repair.
- Index cải thiện read và amplify write.
- Transaction đơn giản hóa invariant nhưng hạn chế partition.
- Derived store hỗ trợ query khác nhưng thêm lag.

Chọn source đơn giản nhất enforce invariant khó nhất.

## Phân tích lỗi

- Dual write database và broker thiếu outbox.
- Xem NoSQL là schema-free.
- Dùng replica cho read-after-write.
- Thiếu uniqueness khi concurrent request.
- Hot tenant overload partition.
- Backfill lock production.
- Delete source trước derived copy và backup.
- Projection không rebuild được.

Mọi mutation phải trả lời: *process dừng sau statement này thì sao?*

## Practice

1. Model checkout entity và năm invariant; map sang constraint, transaction, conditional write hoặc reconciliation.
2. Lập access-pattern table cho order, fulfillment, payment và analytics.
3. Thiết kế migration từ address string sang structured field.
4. So sánh customer-key và hash-key partitioning.`,
      },
    },
    {
      id: 'caching',
      title: { en: 'Caching', vn: 'Caching' },
      baseline: {
        en: ['Understand hits, misses, TTLs, and eviction', 'Identify expensive repeatable reads', 'Recognize cached data can be stale'],
        vn: ['Hiểu hit, miss, TTL và eviction', 'Xác định expensive repeatable read', 'Nhận ra cached data có thể stale'],
      },
      skills: {
        en: ['Choose cache placement, key, and invalidation policy', 'Protect origins from stampedes and hot keys', 'Measure cache value and correctness risk'],
        vn: ['Chọn cache placement, key và invalidation policy', 'Bảo vệ origin khỏi stampede và hot key', 'Đo cache value và correctness risk'],
      },
      diagram: 'caching',
      body: {
        en: `## Analysis

A cache is a **bounded, lossy copy** of data. It can reduce latency, absorb bursts, and protect an expensive origin, but it creates staleness, invalidation, and uneven load. First ask whether repeated reads are expensive enough and reusable enough to justify another copy.

Define the cache contract: source of truth, key, value schema, freshness, admission, eviction, miss behavior, and owner. A high hit ratio is not enough; measure origin work saved and correctness risk.

Compare the system with and without caching. If removing the cache breaks correctness rather than only performance or availability, it has become authoritative and needs durability, recovery, and stronger operational ownership. Make that escalation explicit instead of discovering it during an outage.

## Requirements

For each cached operation, specify:

- Maximum acceptable staleness and revocation time.
- Key namespace, tenant scope, and normalization.
- Value size and sensitive-data policy.
- Expected reuse, working-set size, and skew.
- Behavior on miss, timeout, corruption, and total cache loss.
- Whether stale data may be served during origin failure.

For URL redirects, a disabled malicious link might need to stop within ten seconds. That requirement bounds TTL or requires invalidation and a denylist.

## Features

Useful cache capabilities include:

- **Cache-aside** reads for simple ownership.
- Positive caching for valid mappings.
- Brief negative caching for missing codes.
- Request coalescing for concurrent misses.
- TTL jitter to avoid synchronized expiry.
- Admission control so one-off data does not evict useful entries.
- Explicit invalidation for edits and revocation.
- Per-layer metrics for edge, local, and distributed caches.

Warm only proven hot data. Bulk warming an assumed working set can overload the origin before users arrive.

## Tech choices

Place caches where they remove cost:

- Browser or CDN: lowest latency, least revocation control.
- Process-local: fast and cheap, but inconsistent across instances.
- Distributed cache: shared view, network hop, separate failure domain.
- Database buffer: automatic but not an application freshness contract.

Cache-aside keeps writes simple. Write-through coordinates every write with cache. Write-behind can lose data and should not casually own authoritative state. Prefer the least complex policy that meets freshness.

## Design

For redirects, key by normalized domain or tenant plus short code. Store destination, status, expiry, and a schema or policy version. On miss:

1. Coalesce requests for the same key.
2. Read the source or a replica with acceptable lag.
3. Validate status and expiry.
4. Fill with TTL plus random jitter.
5. Return the result and release waiting requests.

Disable in the source of truth first, then publish invalidation. A synchronous denylist can protect high-risk revocation while ordinary mappings use bounded TTL. During cache loss, rate-limit origin concurrency and shed low-value work.

## Code

~~~js
async function resolve(code) {
  const key = "redirect:" + normalize(code);
  const cached = await cache.get(key);
  if (cached) return cached;

  return singleFlight(key, async () => {
    const link = await store.findActive(code);
    if (!link) {
      await cache.set(key, { missing: true }, { ttl: 5 });
      return null;
    }
    await cache.set(key, link, { ttl: 300 + random(0, 60) });
    return link;
  });
}
~~~

Real code must distinguish a cached negative result from an ordinary miss and cap waiting callers.

## Deploy

Introduce caching with shadow measurements first: record would-hit keys and expected origin savings without serving cached values. Then canary by traffic percentage or key namespace. Verify old and new value schemas coexist during deployment.

Plan cold starts and cache replacement. Limit warmer concurrency, keep database connection budgets, and test complete cache loss under peak traffic. Roll out invalidation producers before relying on consumers, and preserve TTL as a safety bound.

## Trade-offs

- Longer TTL improves hit rate but increases stale exposure.
- More cache layers reduce latency but complicate ownership and invalidation.
- Negative caching protects origins but can hide newly created data.
- Local caches remove a network hop but multiply memory and inconsistency.
- Replicating hot keys improves throughput but increases invalidation fan-out.

Make the cache optional for correctness unless the product deliberately treats it as authoritative.

## Failure modes

Design for:

- **Stampede** after expiry or cold restart.
- A viral **hot key** saturating one shard or network path.
- Cache poisoning or incompatible value schema.
- An invalidation event lost or delayed.
- Eviction churn from oversized or one-use values.
- Cache timeout consuming the full request deadline.
- Authorization cached without identity or policy version.
- Fail-open behavior serving a disabled destination.

Track hit and miss latency, origin requests saved, stale serves, eviction, memory, hot-key distribution, and invalidation age.

## Practice

1. Design a two-level redirect cache with keys, values, TTL, jitter, negative caching, and invalidation.
2. Explain how a 95% hit ratio can coexist with rising database CPU.
3. Design ten-second malicious-link revocation when the invalidation stream is down.
4. Run a failure walkthrough for cold cache, one hot key, corrupt values, and slow origin.`,
        vn: `## Phân tích

Cache là **copy có giới hạn và có thể mất**. Nó giảm latency, hấp thụ burst và bảo vệ origin, nhưng tạo staleness, invalidation và uneven load. Chỉ cache khi repeated read đủ đắt và có reuse.

Cache contract phải nêu source of truth, key, value schema, freshness, admission, eviction, miss behavior và owner. Hit ratio cao chưa chứng minh value.

## Yêu cầu

- Maximum staleness và revocation time.
- Key namespace, tenant scope, normalization.
- Value size và sensitive-data policy.
- Working set, reuse và skew.
- Behavior khi miss, timeout, corruption hoặc total loss.
- Có serve stale khi origin down không.

Với redirect, malicious link phải dừng trong mười giây; requirement này giới hạn TTL hoặc đòi invalidation/denylist.

## Tính năng

- **Cache-aside** cho read đơn giản.
- Positive và brief negative caching.
- Request coalescing cho concurrent miss.
- TTL jitter chống synchronized expiry.
- Admission control bảo vệ working set.
- Explicit invalidation cho edit và revoke.
- Metric riêng cho edge, local, distributed layer.

Chỉ warm hot data đã được chứng minh.

## Công nghệ

- Browser/CDN: latency thấp nhất, revocation control thấp.
- Local cache: nhanh nhưng instance không đồng nhất.
- Distributed cache: shared view, thêm network hop.
- Database buffer: tự động nhưng không là freshness contract.

Write-through thêm coordination; write-behind có data-loss risk. Chọn policy đơn giản nhất đáp ứng freshness.

## Thiết kế

Key redirect bằng normalized domain hoặc tenant cộng short code. Value gồm destination, status, expiry, schema version. Khi miss:

1. Coalesce cùng key.
2. Read source hoặc replica phù hợp.
3. Check status và expiry.
4. Fill với TTL có jitter.
5. Trả result cho waiting request.

Disable source of truth trước rồi publish invalidation. Denylist synchronous bảo vệ high-risk revocation. Khi cache mất, bound origin concurrency.

## Code

~~~js
async function resolve(code) {
  const key = "redirect:" + normalize(code);
  const cached = await cache.get(key);
  if (cached) return cached;
  return singleFlight(key, async () => {
    const link = await store.findActive(code);
    if (!link) return cacheNegative(key, 5);
    await cache.set(key, link, { ttl: 300 + random(0, 60) });
    return link;
  });
}
~~~

Implementation thật phải phân biệt negative result với miss và cap waiting caller.

## Deploy

Shadow measurement trước khi serve cache. Sau đó canary theo traffic hoặc namespace. Old/new value schema phải coexist.

Test cold start và complete cache loss ở peak. Limit warmer concurrency. Deploy invalidation producer trước consumer và giữ TTL làm safety bound.

## Trade-offs

- TTL dài tăng hit nhưng tăng stale.
- Nhiều layer giảm latency nhưng invalidation khó.
- Negative cache bảo vệ origin nhưng che new data.
- Local cache giảm network nhưng nhân memory.
- Replicate hot key tăng throughput và invalidation fan-out.

Cache nên optional cho correctness.

## Phân tích lỗi

- Stampede sau expiry.
- Viral **hot key** overload shard.
- Poisoned hoặc incompatible value.
- Lost invalidation.
- Eviction churn.
- Cache timeout dùng hết deadline.
- Authorization cache thiếu identity/policy version.
- Fail-open serve disabled destination.

Track origin request saved, stale serve, eviction, hot-key distribution và invalidation age.

## Practice

1. Thiết kế redirect cache hai tầng.
2. Giải thích hit ratio 95% nhưng database CPU tăng.
3. Thiết kế revocation mười giây khi invalidation stream down.
4. Walk cold cache, hot key, corrupt value và slow origin.`,
      },
    },
    {
      id: 'url-shortener',
      title: { en: 'Build a URL Shortener', vn: 'Xây dựng hệ thống rút gọn URL' },
      baseline: {
        en: ['Estimate basic traffic, storage, and latency requirements', 'Understand key-value access patterns and simple database indexing', 'Explain cache-aside behavior, TTLs, and cache misses', 'Read basic HTTP request/response flows and REST-style APIs'],
        vn: ['Ước tính yêu cầu cơ bản về lưu lượng, dung lượng lưu trữ và độ trễ', 'Hiểu mô hình truy cập key-value và chỉ mục cơ sở dữ liệu đơn giản', 'Giải thích cơ chế cache-aside, TTL và cache miss', 'Đọc được luồng HTTP request/response và API theo phong cách REST'],
      },
      skills: {
        en: ['Design short-link creation and low-latency redirect paths', 'Compare base62 encoding with hash-based key generation', 'Model uniqueness, collision handling, and custom alias constraints', 'Plan caching, rate limiting, analytics, and horizontal scaling', 'Defend 301 versus 302 redirect behavior using product requirements'],
        vn: ['Thiết kế luồng tạo liên kết ngắn và chuyển hướng có độ trễ thấp', 'So sánh mã hóa base62 với cách tạo khóa dựa trên hàm băm', 'Mô hình hóa tính duy nhất, xử lý va chạm và ràng buộc alias tùy chỉnh', 'Lập kế hoạch cho caching, giới hạn tốc độ, analytics và mở rộng ngang', 'Lựa chọn giữa chuyển hướng 301 và 302 dựa trên yêu cầu sản phẩm'],
      },
      diagram: 'url-shortener',
      body: {
        en: `## Analysis

A URL shortener has a deliberate write path and a minimal read path. Creation validates a destination, reserves a code, and persists one authoritative mapping. Redirect accepts a normalized code, checks status and expiry, and responds without waiting for analytics.

The workload is normally read-heavy, but skew matters more than the average: one viral code can dominate traffic. Define creation QPS, redirect QPS, peak factor, URL size, retention, p99 latency, availability, revocation window, and analytics freshness. Decide whether links are editable, expiring, private, custom, or globally writable.

## Requirements

Core behavior:

- Create a short link for an HTTP or HTTPS destination.
- Resolve active links with low latency.
- Return explicit behavior for missing, expired, and disabled codes.
- Atomically claim custom aliases after normalization.
- Disable abusive links within a bounded propagation time.
- Record click events without blocking redirects.

The critical invariant is: **one normalized active short code maps to exactly one destination**. Two concurrent claims cannot both succeed. Define case sensitivity, Unicode policy, reserved words, maximum destination length, and whether an alias can ever be reused.

## Features

Split features by path:

- Create: authentication, URL validation, rate limits, code allocation, idempotency.
- Redirect: cache lookup, storage fallback, expiry and denylist check, HTTP response.
- Management: list, disable, expire, or edit owned links.
- Analytics: durable event, bot filtering, aggregation, privacy, retention.
- Abuse: destination screening, reports, emergency revocation, audit.

Creation limits protect namespace and review capacity. Redirect limits must tolerate legitimate viral traffic and should focus on infrastructure protection or obvious abuse.

## Tech choices

**Base62 is an encoding, not a key-generation algorithm.** It reversibly represents an already assigned integer using 62 symbols. A database sequence plus base62 guarantees uniqueness, but sequential IDs can reveal volume and make enumeration easier. Range allocation or a distributed ID service can scale writes at added coordination cost.

A random token avoids a central sequence but uses a probabilistic key space. A truncated hash also collides and needs the same atomic insert-and-retry path. Hashing the destination may accidentally impose deduplication: identical destinations receive one code even when owners, expiry, or analytics should differ. Salting avoids that semantic but makes the hash little different from random generation.

Every strategy still uses a **unique constraint or conditional insert**. Check-then-insert in application code is not concurrency-safe.

## Design

Store the mapping in SQL or another conditional-write store:

~~~sql
CREATE TABLE links (
  short_code varchar(16) PRIMARY KEY,
  long_url text NOT NULL,
  owner_id uuid,
  status varchar(16) NOT NULL,
  code_kind varchar(16) NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz
);
~~~

Creation flow:

1. Authenticate or classify the caller; rate-limit.
2. Validate scheme, length, and policy.
3. Normalize a custom alias or generate a candidate.
4. Atomically insert; on generated collision, retry with a strict bound.
5. Return the canonical URL. Reuse an idempotency key for client retries.

Redirect flow:

1. Edge routes to a stateless redirect instance.
2. Check emergency denylist and distributed cache.
3. On miss, read a source whose lag meets activation and revocation guarantees.
4. Fill cache with TTL and jitter; briefly negative-cache missing codes.
5. Return redirect, then enqueue click analytics outside the latency path.

## Code

Collision-safe pseudocode:

~~~js
async function createLink(input, idempotencyKey) {
  const existing = await findByIdempotency(input.owner, idempotencyKey);
  if (existing) return existing;

  for (let attempt = 0; attempt < 5; attempt++) {
    const code = input.alias
      ? normalizeAlias(input.alias)
      : randomBase62(8);
    const inserted = await insertIfAbsent({ code, ...input, idempotencyKey });
    if (inserted) return inserted;
    if (input.alias) throw conflict("alias_taken");
  }
  throw unavailable("code_allocation_exhausted");
}
~~~

The database must also uniquely constrain the idempotency scope. Retrying after an ambiguous timeout should return the original resource, not create another link.

## Deploy

Start with one write region, a relational mapping store, stateless redirect instances, and a distributed cache. Scale application instances horizontally and bound total database connections. Partition mappings by a stable hash of short code only when measured size or throughput requires it.

Test with a skewed distribution, not uniform random keys. Pre-scale known campaigns, replicate proven hot entries at edge or process-local caches, coalesce misses, and add TTL jitter. During cache restart, cap origin concurrency so a stampede does not become a database outage.

Roll out code-length or normalization changes compatibly. Readers must accept old and new codes before writers emit the new form.

## Trade-offs

**301 vs 302 is a product decision.**

- **301 Moved Permanently** enables aggressive browser and CDN caching. It reduces service load, but destination edits and rapid abuse revocation become harder, and request-level analytics undercount because later navigation may bypass the service.
- **302 Found** keeps the service in control for mutable or analytics-sensitive links. It supports faster changes and more observable visits, but every redirect costs service capacity.

Specify Cache-Control with either status; intermediaries differ. Immutable documentation links may use 301 with long caching. Editable campaign links usually favor 302 or another temporary redirect with a bounded cache policy.

Other trade-offs include sequential uniqueness *vs* enumeration, random distribution *vs* collision retries, longer TTL *vs* revocation, and durable analytics *vs* redirect isolation.

## Failure modes

- **Hot key**: one viral code saturates a cache shard or network path despite low fleet average.
- **Stampede**: cache restart or synchronized expiry floods storage.
- **Collision**: random or truncated-hash candidate already exists.
- **Alias race**: two users claim the same normalized alias.
- **Replica lag**: a new or disabled link appears stale.
- **Queue outage**: click events lag or drop without affecting redirect.
- **Poisoned cache**: wrong destination persists until invalidated.
- **Enumeration**: predictable codes expose private or sensitive links.

Use replication, local copies, request coalescing, bounded retries, atomic uniqueness, invalidation, and reconciliation. Do not call a six-character token secure merely because it looks random; calculate its 62⁶ space and threat model.

## Practice

1. Estimate code space, peak QPS, bandwidth, and one-year mapping storage.
2. Choose sequence plus base62, random token, or truncated hash for three different products.
3. Write a failure table for cache loss, storage timeout, expired code, queue outage, and viral hot key.
4. Choose 301 or 302 for immutable docs, editable user links, and analytics campaigns.
5. Extend to multiple regions and state where writes occur, how uniqueness holds, and what replication lag changes.`,
        vn: `## Phân tích

URL shortener có write path chủ đích và read path tối giản. Creation validate destination, reserve code và persist authoritative mapping. Redirect nhận normalized code, check status cùng expiry rồi response mà không chờ analytics.

Workload thường read-heavy nhưng skew quan trọng hơn average: một viral code có thể chiếm phần lớn traffic. Định nghĩa creation/redirect QPS, peak, URL size, retention, p99, availability, revocation window và analytics freshness.

## Yêu cầu

- Create short link cho HTTP/HTTPS destination.
- Resolve active link với latency thấp.
- Behavior rõ cho missing, expired, disabled.
- Atomically claim custom alias.
- Disable abuse trong bounded time.
- Ghi click event ngoài redirect path.

Invariant: **một normalized active code map tới đúng một destination**. Hai concurrent claim không thể cùng success. Chốt case sensitivity, Unicode, reserved word, max URL và alias reuse.

## Tính năng

- Create: auth, validation, rate limit, allocation, idempotency.
- Redirect: cache, storage fallback, expiry, denylist, HTTP response.
- Management: list, disable, expire, edit.
- Analytics: event, bot filter, aggregation, privacy.
- Abuse: screening, report, emergency revocation, audit.

Creation limit bảo vệ namespace; redirect limit phải chịu legitimate viral traffic.

## Công nghệ

**Base62 là encoding, không phải key generator.** Nó biểu diễn reversible một integer đã được cấp. Sequence cộng base62 đảm bảo unique nhưng có thể lộ volume và dễ enumerate. Distributed ID hoặc range allocation tăng scale nhưng thêm coordination.

Random token tránh central sequence nhưng có collision probability. Truncated hash cũng collide và cần atomic insert/retry. Hash destination có thể vô tình deduplicate link dù owner, expiry, analytics khác nhau.

Mọi strategy đều cần **unique constraint hoặc conditional insert**. Application check-then-insert không an toàn khi concurrent.

## Thiết kế

~~~sql
CREATE TABLE links (
  short_code varchar(16) PRIMARY KEY,
  long_url text NOT NULL,
  owner_id uuid,
  status varchar(16) NOT NULL,
  code_kind varchar(16) NOT NULL,
  created_at timestamptz NOT NULL,
  expires_at timestamptz
);
~~~

Create: classify caller, validate URL, normalize/generate candidate, atomic insert, bounded retry, return canonical URL. Redirect: route tới stateless instance, check denylist và cache, fallback storage, fill cache có jitter, trả redirect, enqueue click event.

## Code

~~~js
async function createLink(input, idempotencyKey) {
  const existing = await findByIdempotency(input.owner, idempotencyKey);
  if (existing) return existing;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = input.alias ? normalizeAlias(input.alias) : randomBase62(8);
    const inserted = await insertIfAbsent({ code, ...input, idempotencyKey });
    if (inserted) return inserted;
    if (input.alias) throw conflict("alias_taken");
  }
  throw unavailable("code_allocation_exhausted");
}
~~~

Database cũng phải unique theo idempotency scope.

## Deploy

Bắt đầu bằng single write region, relational store, stateless redirect và distributed cache. Bound tổng connection. Chỉ partition bằng stable hash của code khi throughput đo được yêu cầu.

Load test bằng skewed key. Pre-scale campaign, replicate proven hot entry, coalesce miss, jitter TTL. Khi cache restart, cap origin concurrency. Reader phải hiểu old/new code trước khi writer emit format mới.

## Trade-offs

**301 và 302 là product decision.**

- **301** cho browser/CDN cache mạnh, giảm load nhưng edit, abuse revocation và request analytics khó hơn.
- **302** giữ control cho mutable hoặc analytics-sensitive link nhưng mọi visit đi qua service.

Kèm Cache-Control rõ. Immutable docs có thể dùng 301; editable campaign thường dùng 302 hoặc temporary redirect với bounded cache.

Trade-off khác: sequential uniqueness *vs* enumeration, random distribution *vs* collision retry, long TTL *vs* revocation.

## Phân tích lỗi

- Viral **hot key** overload cache shard.
- Cache restart tạo stampede.
- Random hoặc truncated hash collide.
- Concurrent custom alias race.
- Replica lag cho link mới hoặc disabled.
- Queue outage làm analytics lag.
- Poisoned cache giữ wrong destination.
- Predictable code bị enumerate.

Dùng replication, local copy, coalescing, bounded retry, atomic uniqueness, invalidation và reconciliation. Token sáu ký tự không tự động secure; phải tính 62⁶ space và threat model.

## Practice

1. Ước lượng code space, peak QPS, bandwidth và storage một năm.
2. Chọn base62 sequence, random token hoặc truncated hash cho ba product.
3. Lập failure table cho cache loss, timeout, expired code, queue outage và hot key.
4. Chọn 301/302 cho docs, editable link và campaign.
5. Mở rộng multi-region và nêu write region, uniqueness, replication lag.`,
      },
    },
    {
      id: 'api-design-versioning',
      title: { en: 'API design & versioning', vn: 'Thiết kế API và versioning' },
      baseline: {
        en: ['Model resources, commands, and error responses', 'Separate authentication from authorization', 'Define pagination and filtering contracts'],
        vn: ['Model resource, command và error response', 'Tách authentication khỏi authorization', 'Định nghĩa pagination và filtering contract'],
      },
      skills: {
        en: ['Design stable APIs with explicit semantics and limits', 'Evolve schemas through additive compatible changes', 'Specify idempotency, concurrency, and deprecation'],
        vn: ['Thiết kế API ổn định với semantic và limit rõ', 'Evolve schema bằng additive compatible change', 'Đặc tả idempotency, concurrency và deprecation'],
      },
      diagram: 'api-design-versioning',
      body: {
        en: `## Analysis

An API is a long-lived agreement between independently deployed software. Design it from domain operations and **client recovery**, not from internal tables. For each operation define identity, authorization, validation, state preconditions, idempotency, status, error codes, retryability, and limits.

Versioning preserves meaning while clients evolve at different speeds. A number in a URL does not make a contract safe; additive schemas, compatibility tests, adoption telemetry, and a deprecation policy do.

Review the contract from the consumer’s position. A client must know whether to retry, wait, refresh state, correct input, or ask a user for action. Ambiguous success and generic errors force clients to guess, and those guesses become distributed behavior that is difficult to change later safely.

## Requirements

Document:

- Resource identity and ownership.
- Authentication and resource-level authorization.
- Request limits, defaults, and validation.
- Idempotency scope and retention.
- Concurrency behavior and state preconditions.
- Stable machine-readable errors.
- Pagination order and cursor semantics.
- Compatibility and sunset policy.

For checkout, retrying one accepted command must not create another order or charge. A timeout leaves an uncertain outcome, so the client needs a durable operation identifier or idempotent replay.

## Features

A useful checkout API may support:

- Create or retrieve a checkout attempt.
- Observe pending, accepted, declined, or unknown status.
- Replace a cart conditionally using an entity version.
- List orders with bounded cursor pagination.
- Cancel only from legal states.
- Return safe error detail and a request ID.

Separate authentication from authorization. A valid token identifies a caller; it does not prove that caller owns an order or may perform a transition.

## Tech choices

HTTP resource endpoints suit stable entities; command-style endpoints suit transitions that do not map cleanly to CRUD. Use the protocol semantics consistently:

- 200 for successful retrieval or replayed result.
- 201 for newly created resources.
- 202 for durable work still processing.
- 400/422 for invalid input according to team convention.
- 409 for idempotency payload mismatch or state conflict.
- 412 for failed version precondition.
- 429 with scope and retry guidance.

Prefer additive evolution and capability negotiation before introducing a parallel major version.

## Design

An idempotency key is scoped to caller and operation. Store a canonical request fingerprint and the resulting resource. The same key plus equivalent payload returns the original response; the same key plus different payload returns conflict. Keep records long enough to cover realistic retries.

Errors need a stable code, safe message, request ID, optional field details, and retry guidance. Do not expose exception text or database structure.

For changing lists, use an opaque cursor tied to sort order and filters. Sort by creation time plus unique ID so ties are deterministic. The cursor should not be accepted with different filters.

## Code

~~~http
POST /v1/checkout-attempts
Idempotency-Key: 5df0...
If-Match: "cart-v17"
Content-Type: application/json

{"cart_id":"c_123","payment_method_id":"pm_456"}
~~~

~~~json
{
  "id": "ca_789",
  "status": "pending",
  "poll_after_ms": 1000,
  "request_id": "req_abc"
}
~~~

For errors:

~~~json
{"code":"idempotency_conflict","message":"Key reused with different input","retryable":false,"request_id":"req_abc"}
~~~

## Deploy

Treat response schemas as append-only by default. Clients must tolerate unknown response fields, and servers must not reinterpret existing fields. Add enum values carefully: older clients need an “unknown” fallback.

Deploy compatible server readers before new writers. Measure traffic and success by client version, capability, and endpoint. A breaking semantic change needs a migration guide, overlap window, direct owner communication, sunset headers where applicable, and an end condition based on telemetry.

Keep rollback compatible with data written by the new version.

## Trade-offs

- Path versioning is visible but can duplicate operations.
- Header negotiation keeps URLs stable but is harder to inspect.
- Strict validation catches errors but can reject harmless future fields.
- Long idempotency retention costs storage but prevents delayed duplicates.
- Offset pagination is simple but unstable and expensive on changing large lists.
- Fine-grained errors help recovery but create a larger client contract.

Version behavior only when semantics truly break; do not version every field.

## Failure modes

- Ambiguous timeout causes duplicate side effects.
- Reused idempotency key with different payload is accepted.
- Old mobile clients crash on a new enum.
- Pagination skips or duplicates items while rows arrive.
- Authentication is mistaken for authorization.
- Rate limits omit scope, reset, or retry behavior.
- Optional input changes default meaning.
- A server silently changes existing status semantics.
- Deprecation proceeds without adoption evidence.

Contract tests should replay old fixtures against new servers and new optional fields against tolerant clients.

## Practice

1. Write an idempotent checkout contract for payload mismatch, in-progress retry, timeout, success, and decline.
2. Design cursor pagination for orders sorted by creation time and ID.
3. Plan migration from one address string to structured fields across two mobile versions.
4. Create a compatibility checklist for adding a new payment status.`,
        vn: `## Phân tích

API là agreement lâu dài giữa software deploy độc lập. Thiết kế từ domain operation và **client recovery**, không từ internal table. Với mỗi operation, định nghĩa identity, authorization, validation, precondition, idempotency, error, retryability và limit.

Versioning giữ meaning khi client evolve khác tốc độ. Số trong URL không đủ; cần additive schema, compatibility test, adoption telemetry và deprecation policy.

## Yêu cầu

- Resource identity và ownership.
- Authentication cùng resource authorization.
- Request limit, default, validation.
- Idempotency scope và retention.
- Concurrency và state precondition.
- Stable machine error.
- Pagination order và cursor.
- Compatibility và sunset.

Retry checkout không được tạo order hoặc charge thứ hai.

## Tính năng

- Create/retrieve checkout attempt.
- Observe pending, accepted, declined, unknown.
- Conditional cart update bằng version.
- Order list có cursor.
- Cancel từ legal state.
- Safe error detail và request ID.

Valid token xác định caller nhưng không chứng minh quyền trên resource.

## Công nghệ

Dùng HTTP semantic nhất quán: 200 cho retrieval/replay, 201 create, 202 durable pending, 409 conflict, 412 failed precondition, 429 có retry guidance. Resource endpoint hợp stable entity; command endpoint hợp transition không tự nhiên là CRUD.

Ưu tiên additive evolution và capability negotiation trước major version mới.

## Thiết kế

Idempotency key scoped theo caller và operation. Lưu canonical request fingerprint cùng result. Cùng key và equivalent payload trả original response; payload khác trả conflict.

Error gồm stable code, safe message, request ID, field detail và retry guidance. Cursor phải opaque, gắn với sort/filter, và dùng timestamp cộng unique ID để tie-break.

## Code

~~~http
POST /v1/checkout-attempts
Idempotency-Key: 5df0...
If-Match: "cart-v17"

{"cart_id":"c_123","payment_method_id":"pm_456"}
~~~

~~~json
{"id":"ca_789","status":"pending","poll_after_ms":1000,"request_id":"req_abc"}
~~~

Error:

~~~json
{"code":"idempotency_conflict","retryable":false,"request_id":"req_abc"}
~~~

## Deploy

Xem response schema là append-only. Client chịu unknown field; server không reinterpret field cũ. Old client cần fallback cho unknown enum.

Deploy reader trước writer. Đo traffic/success theo client version. Breaking change cần migration guide, overlap window, sunset signal và end condition theo telemetry. Rollback phải hiểu data do version mới ghi.

## Trade-offs

- Path version rõ nhưng duplicate operation.
- Header negotiation giữ URL nhưng khó inspect.
- Strict validation bắt lỗi nhưng có thể reject future field.
- Idempotency retention dài tốn storage.
- Offset pagination đơn giản nhưng unstable.
- Nhiều error code tăng contract surface.

Chỉ version khi semantic thật sự break.

## Phân tích lỗi

- Timeout tạo duplicate effect.
- Cùng key với payload khác được accept.
- Old client crash vì enum mới.
- Pagination skip/duplicate khi row đến.
- Authentication thay thế authorization.
- Rate limit thiếu scope/reset.
- Optional input đổi default.
- Existing status bị đổi meaning.
- Deprecation thiếu adoption evidence.

Contract test phải chạy old fixture với new server.

## Practice

1. Viết idempotent checkout contract.
2. Thiết kế cursor theo creation time và ID.
3. Lập migration address string sang structured field.
4. Tạo checklist khi thêm payment status.`,
      },
    },
    {
      id: 'services-queues-async',
      title: { en: 'Services, queues, async', vn: 'Service, queue và xử lý bất đồng bộ' },
      baseline: {
        en: ['Distinguish synchronous calls from asynchronous messages', 'Understand queue, consumer, acknowledgement, and dead-letter basics', 'Identify work that need not block a request'],
        vn: ['Phân biệt synchronous call và asynchronous message', 'Hiểu queue, consumer, acknowledgement và dead-letter cơ bản', 'Xác định work không cần block request'],
      },
      skills: {
        en: ['Choose service boundaries from ownership and invariants', 'Design workflows for duplicates and reordering', 'Apply backpressure, bounded retries, and repair'],
        vn: ['Chọn service boundary từ ownership và invariant', 'Thiết kế workflow cho duplicate và reorder', 'Áp dụng backpressure, bounded retry và repair'],
      },
      diagram: 'services-queues-async',
      body: {
        en: `## Analysis

Asynchrony separates **acceptance** from **completion**. It can keep a request fast and available while downstream work continues, but it replaces a call stack with a distributed state machine. A queue does not remove failure; it stores work while rate, retries, ordering, and ownership are managed.

Choose service boundaries around cohesive data, invariants, and team ownership. Splitting every noun into a service turns local transactions into network workflows without creating useful autonomy.

## Requirements

For each workflow define:

- What must complete before the user receives success.
- Where intent becomes durable.
- Delivery guarantee and ordering scope.
- Idempotency key and duplicate behavior.
- Retry limit, backoff, and dead-letter owner.
- Maximum queue age and end-to-end completion time.
- Replay, reconciliation, and cancellation semantics.

Assume **at-least-once delivery** unless a narrower transaction proves otherwise. Consumers may see duplicates, delays, and reorderings.

## Features

Checkout acceptance can synchronously validate policy, deduplicate the request, create an order intent, and commit an outbox event. Payment, reservation, fulfillment, email, and analytics may then advance explicit states.

Each message should include event ID, aggregate ID, aggregate version, occurrence time, producer, and schema version. Consumers acknowledge only after durable effects. User-facing status must distinguish accepted work from completed work; “success” cannot mean “queued somewhere” unless the product explicitly defines it that way.

## Tech choices

Use a direct synchronous call when the caller needs an immediate answer and the dependency fits the deadline. Use a queue when work can finish later, needs burst buffering, or must survive downstream outage.

A queue is a **finite buffer**, not unlimited capacity. Select partition keys for both ordering and load. Ordering by order ID supports one order’s sequence; ordering every event globally destroys parallelism. A managed broker reduces operations but does not decide business retries or idempotency.

Use orchestration when one workflow owner needs visible state and compensation. Choreography can reduce central coupling but becomes hard to trace when many services react implicitly.

## Design

Transactional outbox avoids an unsafe database-plus-broker dual write:

1. Commit domain state and an outbox row in one database transaction.
2. A publisher reads unpublished rows and sends messages.
3. Mark or checkpoint publication.
4. Consumers deduplicate by event or business key.
5. Reconciliation repairs missing or stuck outcomes.

Track arrival rate, service rate, backlog count, **oldest message age**, retry volume, and poison count. Oldest age maps more directly to user delay than backlog alone.

Apply backpressure by limiting consumer concurrency, pausing low-value producers, rejecting excess work, or degrading optional features.

## Code

~~~sql
BEGIN;
INSERT INTO orders(id, status) VALUES (:id, 'accepted');
INSERT INTO outbox(event_id, aggregate_id, type, payload)
VALUES (:event_id, :id, 'order.accepted', :payload);
COMMIT;
~~~

Idempotent consumer:

~~~sql
BEGIN;
INSERT INTO processed_events(consumer, event_id)
VALUES ('inventory', :event_id)
ON CONFLICT DO NOTHING;
-- Continue only when one row was inserted.
UPDATE orders SET inventory_status = :status
WHERE id = :order_id AND version = :expected_version;
COMMIT;
~~~

The deduplication record and side effect must share a transaction when possible.

## Deploy

Deploy consumers that understand a new optional field before producers send it. Keep message changes additive and retain schema fixtures. During a consumer rollout, both versions may process messages, so idempotency must not depend on instance memory.

Canary by partition or consumer group, monitor age and error class, and keep a fast pause mechanism. Size visibility timeout above normal processing but below the recovery objective. Test replay with production-like volume and verify it does not overwhelm dependencies.

## Trade-offs

- Async work improves request isolation but adds delayed failure and status complexity.
- More partitions increase throughput but weaken ordering scope.
- Larger batches improve efficiency but increase latency and replay size.
- Long retries may recover transient faults but block newer work.
- Dead-lettering preserves progress but creates operator repair work.
- More services increase deployment autonomy while multiplying network and data consistency concerns.

Choose boundaries and queues for current evidence, not hypothetical scale.

## Failure modes

- Duplicate delivery repeats a non-idempotent side effect.
- Reordered events move an aggregate backward.
- Poison messages retry forever.
- A consumer acknowledges before persisting its effect.
- Outbox publication stops while API traffic remains healthy.
- A dead-letter queue has no owner or re-drive policy.
- Retry traffic overwhelms a recovering dependency.
- One partition key becomes hot.
- Schema changes break old consumers.

Bound retries with exponential backoff and jitter. Classify permanent validation errors separately from transient dependency failures. Reconcile authoritative systems instead of trusting queue emptiness.

## Practice

1. Draw checkout acceptance and completion with durable points, acknowledgements, and user-visible states.
2. Design retry policies for email, payment timeout, invalid inventory event, and analytics outage.
3. At 500 messages/s and 40 messages/s per consumer, calculate required concurrency plus failure headroom.
4. Design a replay that processes one week of events without harming live traffic.`,
        vn: `## Phân tích

Asynchrony tách **acceptance** khỏi **completion**. Nó giữ request nhanh khi downstream work tiếp tục, nhưng thay call stack bằng distributed state machine. Queue lưu work; nó không loại failure.

Chọn service boundary quanh cohesive data, invariant và ownership. Tách mọi noun thành service sẽ biến local transaction thành network workflow.

## Yêu cầu

- Work nào phải xong trước success.
- Intent durable ở đâu.
- Delivery guarantee và ordering scope.
- Idempotency và duplicate behavior.
- Retry, backoff, dead-letter owner.
- Maximum queue age và completion time.
- Replay, reconciliation, cancellation.

Mặc định **at-least-once**: consumer có thể nhận duplicate, delay và reorder.

## Tính năng

Checkout acceptance synchronously validate, deduplicate, create order intent và commit outbox. Payment, inventory, fulfillment, email, analytics advance state sau.

Message gồm event ID, aggregate ID/version, time, producer, schema version. Consumer chỉ acknowledge sau durable effect. User status phải tách accepted khỏi completed.

## Công nghệ

Synchronous call khi caller cần answer ngay. Queue khi work có thể hoàn tất sau, cần buffer burst hoặc sống qua downstream outage.

Queue là **finite buffer**. Partition key quyết định ordering lẫn load. Order ID giữ sequence của một order; global ordering phá parallelism. Orchestration cho workflow owner rõ; choreography giảm central coupling nhưng khó trace.

## Thiết kế

Transactional outbox:

1. Commit domain state và outbox row cùng transaction.
2. Publisher gửi unpublished row.
3. Checkpoint publication.
4. Consumer deduplicate.
5. Reconciliation repair missing outcome.

Track arrival rate, service rate, backlog, **oldest age**, retry và poison count. Apply backpressure bằng limit concurrency, pause low-value producer hoặc reject excess work.

## Code

~~~sql
BEGIN;
INSERT INTO orders(id, status) VALUES (:id, 'accepted');
INSERT INTO outbox(event_id, aggregate_id, type, payload)
VALUES (:event_id, :id, 'order.accepted', :payload);
COMMIT;
~~~

~~~sql
BEGIN;
INSERT INTO processed_events(consumer, event_id)
VALUES ('inventory', :event_id)
ON CONFLICT DO NOTHING;
UPDATE orders SET inventory_status = :status
WHERE id = :order_id AND version = :expected_version;
COMMIT;
~~~

Dedup record và side effect nên cùng transaction.

## Deploy

Deploy consumer hiểu optional field trước producer. Giữ schema additive. Hai consumer version có thể cùng chạy nên không dùng in-memory dedup.

Canary theo partition/group, monitor age/error, có pause nhanh. Test replay ở production-like volume mà không làm hại live traffic.

## Trade-offs

- Async tăng isolation nhưng failure xuất hiện trễ.
- Nhiều partition tăng throughput, giảm ordering scope.
- Batch lớn hiệu quả nhưng tăng latency.
- Retry dài block work mới.
- Dead-letter giữ progress nhưng tạo repair.
- Nhiều service tăng autonomy và network concern.

## Phân tích lỗi

- Duplicate lặp non-idempotent effect.
- Reorder làm aggregate lùi state.
- Poison message retry vô hạn.
- Acknowledge trước persist.
- Outbox publisher dừng.
- Dead-letter không owner.
- Retry overload dependency.
- Hot partition.
- Schema break old consumer.

Dùng bounded retry, backoff có jitter, tách permanent khỏi transient error và reconcile source of truth.

## Practice

1. Vẽ checkout acceptance/completion.
2. Thiết kế retry cho email, payment, invalid event, analytics.
3. Tính concurrency cho 500 message/s ở 40 message/s mỗi consumer.
4. Thiết kế replay một tuần không hại live traffic.`,
      },
    },
    {
      id: 'load-balancing-scale',
      title: { en: 'Load balancing & horizontal scale', vn: 'Load balancing và horizontal scale' },
      baseline: {
        en: ['Understand stateless instances and health checks', 'Distinguish vertical from horizontal scaling', 'Know common balancing inputs and algorithms'],
        vn: ['Hiểu stateless instance và health check', 'Phân biệt vertical và horizontal scaling', 'Biết balancing input và algorithm phổ biến'],
      },
      skills: {
        en: ['Design balanced paths and autoscaling signals', 'Handle hot partitions, connection limits, and traffic shifts', 'Scale stateful dependencies with partition strategy'],
        vn: ['Thiết kế balanced path và autoscaling signal', 'Xử lý hot partition, connection limit và traffic shift', 'Scale stateful dependency bằng partition strategy'],
      },
      diagram: 'load-balancing-scale',
      body: {
        en: `## Analysis

Horizontal scale works when independent workers can process units without a shared bottleneck. A load balancer distributes traffic; it cannot create database capacity, erase stateful sessions, or fix a hot key. Follow the complete path from global entry through region, zone, instance, cache shard, database connection, and storage partition.

For each layer, name the balancing key, algorithm, health meaning, capacity unit, and failure scope. Reserve headroom for a zone loss and deployments, not only normal peak.

## Requirements

Define:

- Peak request rate and request-cost distribution.
- Geographic routing and data-residency constraints.
- Per-zone capacity and tolerated failures.
- Connection, concurrency, and queue limits.
- Health-check and drain behavior.
- Scale-up lead time and scale-down safety.
- Stateful partition key and rebalancing plan.
- Overload behavior and rejected-load target.

The invariant is that traffic reaches only an instance that can serve it within the caller’s deadline.

## Features

A global redirect path may include:

- DNS or anycast global routing.
- Regional load balancing.
- Zone-aware target distribution.
- Stateless redirect instances.
- Distributed and edge caches.
- Storage replicas or partitions.
- Autoscaling and scheduled pre-scaling.
- Connection draining during release.

Keep application instances disposable. Session affinity is justified only by a measured state or locality requirement; otherwise it creates skew and hidden state.

## Tech choices

Round robin works for similar request costs. Least outstanding requests adapts better to variable service time. Weighted algorithms support mixed instance capacity. Consistent hashing improves locality and limits remapping, but **does not solve popularity**; one hot key remains hot.

Readiness means an instance may receive traffic. Liveness means the process cannot recover without restart. Startup checks allow warm-up. Do not fail all readiness because an optional dependency is down, and do not report ready before critical configuration or listeners are usable.

Scale from the constrained resource: concurrency, queue delay, latency, memory, connections, or dependency saturation. CPU alone is often late or irrelevant.

## Design

Size a three-zone fleet for one-zone loss. At 20,000 peak RPS and 400 safe RPS per instance, normal capacity needs 50 instances. To survive one of three equal zones, the remaining two zones must carry all traffic: each zone needs 25 instances, so deploy at least 75 total before rollout and safety margin.

Bound database pools globally:

~~~text
total possible DB connections =
  regions × zones × instances per zone × pool size
~~~

If storage allows 600 connections and 75 instances run, a pool of 20 would request 1,500 connections. Use smaller pools, a proxy, or explicit concurrency. More application instances can otherwise reduce total capacity.

## Code

Health endpoints should be narrow:

~~~js
app.get("/live", (_req, res) => {
  res.sendStatus(processIsRecoverable() ? 200 : 500);
});

app.get("/ready", (_req, res) => {
  const ready = configLoaded() && listenerReady() && !draining();
  res.sendStatus(ready ? 200 : 503);
});
~~~

Dependency health belongs in metrics and traffic policy unless every request truly requires it. During drain, stop new traffic, allow bounded in-flight completion, then terminate.

## Deploy

Use gradual traffic shifts and verify per-zone saturation, p99 latency, errors, and rejected load. Set minimum capacity before rollout so autoscaling does not compete with a deployment. Respect warm-up; newly started instances may load code, establish pools, and fill caches.

Test a zone evacuation, slow instance, connection storm, and cache restart. Pre-scale announced campaigns. Autoscaling needs stabilization windows and conservative scale-down to avoid oscillation.

Partition state only with a routing and migration plan. Dual-read or forwarding strategies can support rebalancing, but every transition needs observability and rollback.

## Trade-offs

- More spare capacity costs money but absorbs failure and rollout.
- Least-outstanding improves variable work distribution but needs current state.
- Consistent hashing increases locality but can worsen hot-key concentration.
- Sticky sessions simplify local state but reduce flexibility and balance.
- Fast scale-down saves cost but drops warm capacity and connections.
- Active-active regions improve latency but complicate data consistency.

Scale the bottleneck, not the most visible tier.

## Failure modes

- Shallow health sends traffic to broken targets.
- Dependency-heavy health removes the whole fleet.
- Autoscaling arrives after a sudden burst.
- Every new instance opens a large database pool.
- One zone or partition receives skewed traffic.
- Retry traffic hides true arrival rate.
- Scale-down terminates long requests.
- A bad control-plane change shifts all traffic at once.
- Uniform load tests miss viral keys and expensive requests.

Use load shedding, bounded queues, circuit breaking, hot-key replication, and capacity isolation. Record rejected work explicitly.

## Practice

1. Design a global redirect path with algorithm, health, timeout, and capacity at each layer.
2. Size a fleet for 20,000 peak RPS at 400 RPS per instance with one-zone loss.
3. Diagnose rising database latency after adding instances using pool arithmetic.
4. Plan a storage rebalancing operation with live traffic and rollback.`,
        vn: `## Phân tích

Horizontal scale hoạt động khi independent worker xử lý unit mà không có shared bottleneck. Load balancer không tạo database capacity, xóa session state hay sửa hot key. Theo toàn path từ global entry qua region, zone, instance, cache shard, connection và partition.

Mỗi layer cần balancing key, algorithm, health semantic, capacity unit và failure scope. Dành headroom cho zone loss và deploy.

## Yêu cầu

- Peak rate và request-cost distribution.
- Geographic routing và residency.
- Per-zone capacity, failure tolerance.
- Connection, concurrency, queue limit.
- Health và drain behavior.
- Scale lead time.
- Partition key và rebalancing.
- Overload behavior.

Traffic chỉ được tới instance có thể serve trong deadline.

## Tính năng

Global redirect path gồm global routing, regional LB, zone distribution, stateless instance, cache, storage replica/partition, autoscaling và connection drain.

Giữ instance disposable. Sticky session chỉ dùng khi có state/locality requirement đo được.

## Công nghệ

Round robin hợp request tương tự; least outstanding hợp variable service time; weighted algorithm cho mixed capacity. Consistent hashing tăng locality nhưng **không giải popularity**.

Readiness nghĩa là nhận traffic được; liveness nghĩa process cần restart. Startup check cho warm-up. Scale theo constrained resource như concurrency, queue delay, connection hoặc dependency saturation, không mặc định CPU.

## Thiết kế

20.000 peak RPS, mỗi instance an toàn 400 RPS cần 50 instance. Với ba zone và chịu mất một zone, hai zone còn lại phải gánh hết: mỗi zone cần 25, tổng ít nhất 75 trước safety margin.

~~~text
total DB connections =
  regions × zones × instances × pool size
~~~

75 instance với pool 20 tạo 1.500 connection; nếu database chỉ cho 600 thì thêm instance làm system tệ hơn.

## Code

~~~js
app.get("/live", (_req, res) => {
  res.sendStatus(processIsRecoverable() ? 200 : 500);
});
app.get("/ready", (_req, res) => {
  const ready = configLoaded() && listenerReady() && !draining();
  res.sendStatus(ready ? 200 : 503);
});
~~~

Khi drain, dừng new traffic, chờ bounded in-flight rồi terminate.

## Deploy

Shift traffic dần và verify per-zone saturation, p99, error, rejected load. Giữ minimum capacity khi rollout, tính warm-up và dùng conservative scale-down.

Test zone evacuation, slow instance, connection storm, cache restart. Pre-scale known campaign. Partition state chỉ khi có routing, migration, observability và rollback.

## Trade-offs

- Headroom tốn cost nhưng chịu failure.
- Least-outstanding cần current state.
- Consistent hash tăng locality nhưng hot key vẫn hot.
- Sticky session giảm flexibility.
- Fast scale-down mất warm capacity.
- Active-active tăng consistency complexity.

## Phân tích lỗi

- Health nông gửi traffic tới broken target.
- Health quá sâu remove toàn fleet.
- Autoscaling đến sau burst.
- New instance mở pool quá lớn.
- Zone hoặc partition skew.
- Retry che arrival rate.
- Scale-down cắt long request.
- Control-plane change shift toàn traffic.
- Uniform load test bỏ viral key.

Dùng shedding, bounded queue, circuit breaker, hot-key replication và capacity isolation.

## Practice

1. Thiết kế global redirect path.
2. Size fleet 20.000 RPS có one-zone loss.
3. Chẩn đoán database latency bằng pool arithmetic.
4. Lập rebalancing plan có rollback.`,
      },
    },
    {
      id: 'reliability-failures',
      title: { en: 'Reliability: retries, idempotency, failure domains', vn: 'Độ tin cậy: retry, idempotency và failure domain' },
      baseline: {
        en: ['Understand timeout, retry, and partial failure', 'Identify duplicate side effects', 'Know basic zone and region boundaries'],
        vn: ['Hiểu timeout, retry và partial failure', 'Xác định duplicate side effect', 'Biết zone và region boundary cơ bản'],
      },
      skills: {
        en: ['Design bounded retries with budgets and jitter', 'Place idempotency at durable side-effect boundaries', 'Use failure domains, degradation, and recovery objectives'],
        vn: ['Thiết kế bounded retry với budget và jitter', 'Đặt idempotency ở durable side-effect boundary', 'Dùng failure domain, degradation và recovery objective'],
      },
      diagram: 'reliability-failures',
      body: {
        en: `## Analysis

Distributed systems fail partially. A caller times out while the callee succeeds, a zone loses network while processes remain alive, or a dependency becomes slow instead of clearly down. Reliability comes from designing these **ambiguous states**, not from adding retries everywhere.

Treat each remote call as an uncertain state transition. Before calling, know its deadline, side effect, idempotency mechanism, retry owner, and outcome-discovery method. Define the user-visible degradation when the outcome cannot be decided online.

## Requirements

For every critical journey, specify:

- End-to-end deadline and per-hop timeouts.
- Idempotency scope, key storage, and retention.
- Retryable errors, maximum attempts, and shared budget.
- Failure domains: process, host, zone, region, account, provider, control plane.
- RPO and RTO for each data class.
- Degraded modes and admission control.
- Reconciliation, backup restore, and operator review.

For payment, an uncertain response must never cause an unbounded or duplicate charge. Orders, payment evidence, and analytics may have different recovery objectives.

## Features

Reliability mechanisms include:

- Deadlines propagated from the caller.
- Exponential backoff with jitter.
- Durable idempotency at the side-effect boundary.
- Circuit breaking and cautious recovery probes.
- Bulkheads for tenants, dependencies, or work classes.
- Load shedding and bounded queues.
- Multi-zone placement and tested failover.
- Reconciliation for unresolved outcomes.

Use each mechanism for a named failure. A circuit breaker is not a substitute for timeouts, and replicas do not help if they share a bad deployment or provider.

## Tech choices

Retry only when the operation is idempotent or has not crossed its effect boundary. Choose one retry owner. If client, gateway, service, SDK, and broker each make three attempts, one request can multiply into hundreds of calls.

Timeouts must fit inside the upstream deadline and leave time to persist the result. A connection timeout, request timeout, and workflow deadline solve different problems. Circuit breakers should open on sustained dependency harm, not ordinary business declines.

Multi-region is useful only when data, identity, routing, control plane, dependencies, and operational access are examined for correlated failure.

## Design

For payment:

1. Create a durable PaymentAttempt with a unique internal and provider idempotency key.
2. Commit before calling the provider.
3. Reuse the same provider key on every attempt.
4. If the response is lost, mark outcome **unknown**.
5. Query provider status or reconcile before creating another charge.
6. Advance order state with guarded transitions.

Define states such as created, submitted, succeeded, declined, unknown, and reconciled. A business decline is terminal and should not be retried as an infrastructure failure.

Spread capacity across zones with enough headroom for one-zone loss. Decide whether region failure stops checkout, routes to a single writer, or accepts durable unpaid intent.

## Code

~~~js
async function charge(attempt, deadline) {
  for (let n = 0; n < 3; n++) {
    try {
      return await provider.charge(attempt.payload, {
        idempotencyKey: attempt.providerKey,
        timeout: remaining(deadline) - PERSIST_MARGIN_MS,
      });
    } catch (error) {
      if (!isTransient(error) || n === 2) throw error;
      await sleep(jitter(100 * 2 ** n));
    }
  }
}
~~~

In production, the retry budget must also stop when too little deadline remains. Persist an unknown outcome rather than guessing failure.

## Deploy

Use canaries and fault injection to test dependency timeout, zone loss, credential failure, and slow storage. Verify retries remain bounded and that failure does not spread through shared pools.

Backups are not recovery until restored. Run restore drills, measure actual RPO/RTO, verify credentials and routing, and reconcile records afterward. Exercise regional traffic shifts before incidents.

Roll out timeout or retry changes carefully; a small configuration change can multiply load. Observe attempts per original request and retry budget consumption.

## Trade-offs

- Short timeouts protect capacity but create more uncertain outcomes.
- Retries recover transient faults but amplify overload.
- More replicas improve availability but increase coordination and stale state.
- Single-writer regions simplify correctness but increase failover latency.
- Active-active writes reduce regional latency but require conflict rules.
- Failing open preserves availability but may violate security or money invariants.
- Compensation restores business state but is another action that can fail.

Make the product consequence explicit.

## Failure modes

- Nested retries create a storm.
- In-memory idempotency disappears on restart.
- Deduplication occurs after the external effect.
- Timeout exceeds the caller’s remaining deadline.
- All replicas share a provider, control plane, or bad release.
- Circuit breaker recovery sends a synchronized surge.
- Failover promotes stale or incomplete state.
- Backup restore is too slow or untested.
- Compensation fails halfway.
- Operators cannot discover an unknown outcome.

Monitor duplicate-effect count, unknown outcomes, attempts per request, timeout class, breaker state, zonal saturation, and reconciliation age.

## Practice

1. Design payment-attempt states for success, decline, timeout, duplicate, outage, and reconciliation.
2. Show retry amplification in a three-hop path and replace it with one owner and budget.
3. Build a failure-domain table for process, zone, region, database, identity, provider, and deployment.
4. Write a regional recovery drill with exact evidence for restored invariants.`,
        vn: `## Phân tích

Distributed system hỏng từng phần: caller timeout khi callee success, zone mất network khi process còn sống, dependency slow thay vì down. Reliability đến từ thiết kế **ambiguous state**, không phải thêm retry khắp nơi.

Với mỗi remote call, biết deadline, side effect, idempotency, retry owner và cách discover outcome.

## Yêu cầu

- End-to-end deadline và per-hop timeout.
- Idempotency scope, storage, retention.
- Retryable error, max attempt, shared budget.
- Failure domain: process, zone, region, provider, control plane.
- RPO/RTO theo data class.
- Degraded mode và admission control.
- Reconciliation, restore, operator review.

Uncertain payment không được tạo duplicate hoặc unbounded charge.

## Tính năng

- Propagated deadline.
- Exponential backoff có jitter.
- Durable idempotency.
- Circuit breaker và recovery probe.
- Bulkhead.
- Load shedding, bounded queue.
- Multi-zone placement.
- Reconciliation.

Mỗi mechanism phải gắn với failure cụ thể.

## Công nghệ

Chỉ retry khi operation idempotent hoặc chưa qua effect boundary. Chọn một retry owner; nhiều layer cùng retry sẽ nhân request.

Timeout phải nằm trong upstream deadline và chừa thời gian persist. Circuit breaker mở vì sustained dependency harm, không vì business decline. Multi-region phải xét shared identity, routing, provider và control plane.

## Thiết kế

Payment flow:

1. Tạo durable PaymentAttempt và provider key unique.
2. Commit trước provider call.
3. Reuse key ở mọi attempt.
4. Mất response thì đánh dấu **unknown**.
5. Query status hoặc reconcile trước another charge.
6. Guard order transition.

State có created, submitted, succeeded, declined, unknown, reconciled. Business decline không retry.

## Code

~~~js
async function charge(attempt, deadline) {
  for (let n = 0; n < 3; n++) {
    try {
      return await provider.charge(attempt.payload, {
        idempotencyKey: attempt.providerKey,
        timeout: remaining(deadline) - PERSIST_MARGIN_MS,
      });
    } catch (error) {
      if (!isTransient(error) || n === 2) throw error;
      await sleep(jitter(100 * 2 ** n));
    }
  }
}
~~~

Dừng retry nếu deadline không đủ; persist unknown thay vì đoán failure.

## Deploy

Canary và fault injection dependency timeout, zone loss, credential failure, slow storage. Verify retry bounded và pool isolation.

Backup chỉ có giá trị sau restore drill. Đo RPO/RTO thật, verify credential/routing và reconcile. Rollout timeout/retry config chậm vì nó có thể multiply load.

## Trade-offs

- Timeout ngắn bảo vệ capacity nhưng tăng unknown.
- Retry recover transient fault nhưng amplify overload.
- Replica tăng availability và stale risk.
- Single writer đơn giản nhưng failover chậm.
- Active-active cần conflict rule.
- Fail-open có thể vi phạm invariant.
- Compensation cũng có thể fail.

## Phân tích lỗi

- Nested retry storm.
- In-memory idempotency mất khi restart.
- Dedup sau external effect.
- Timeout vượt caller deadline.
- Replica share same failure.
- Breaker recovery tạo surge.
- Failover lên stale state.
- Restore chưa test.
- Compensation fail.
- Unknown outcome không discover được.

Monitor duplicate effect, unknown count, attempts/request, breaker và reconciliation age.

## Practice

1. Thiết kế payment state.
2. Sửa retry amplification trong path ba hop.
3. Lập failure-domain table.
4. Viết regional recovery drill.`,
      },
    },
    {
      id: 'observability-basics',
      title: { en: 'Observability basics', vn: 'Nền tảng observability' },
      baseline: {
        en: ['Understand logs, metrics, traces, and alerts', 'Distinguish symptoms from internal causes', 'Interpret percentiles and error rates'],
        vn: ['Hiểu log, metric, trace và alert', 'Phân biệt symptom khỏi internal cause', 'Diễn giải percentile và error rate'],
      },
      skills: {
        en: ['Instrument journeys with stable correlation', 'Define SLIs, SLOs, dashboards, and actionable alerts', 'Control cardinality, sampling, retention, and sensitive data'],
        vn: ['Instrument journey với stable correlation', 'Định nghĩa SLI, SLO, dashboard và actionable alert', 'Kiểm soát cardinality, sampling, retention và sensitive data'],
      },
      diagram: 'observability-basics',
      body: {
        en: `## Analysis

Observability is the ability to connect **user impact** to path, state, change, and owner using signals from a running system. It is not the number of dashboards. Start from a journey outcome and work inward; a healthy process can still produce failed payments or stale inventory.

Metrics summarize trends and support alerts. Logs explain discrete events. Traces show timing and causality across boundaries. Each signal needs a question, bounded dimensions, retention, privacy rule, and owner.

Design signals before an incident, but validate them during realistic failures. The useful test is whether an engineer can identify the affected users, failing dependency, triggering change, and safe mitigation without deploying extra diagnostic code.

## Requirements

Define an SLI with numerator, denominator, population, and exclusions. Then define an SLO with target and window. For checkout:

- Availability: valid submissions reaching accepted or declined.
- Latency: time from submission to durable user-visible outcome.
- Correctness: unknown or duplicate payment outcomes.
- Freshness: age of fulfillment or analytics processing.

Specify telemetry loss monitoring, time synchronization, correlation fields, sampling, retention, and sensitive-data policy. Exclusions must represent requests the service truly does not own, not hide harm.

## Features

Instrument:

- **RED** for services: rate, errors, duration.
- **USE** for resources: utilization, saturation, errors.
- Business state: accepted orders, declines, unknown payments, deduplication, reconciliation.
- Queue state: arrival, completion, oldest age, retry, poison count.
- Change context: release, region, configuration version, feature flag.

Build a journey dashboard before component dashboards. Link alerts to runbooks and traces. Every page should identify an action an on-call engineer can take.

## Tech choices

Use metric labels only for bounded values such as region, endpoint, status class, payment method category, and release. User IDs, order IDs, raw URLs, and error messages create unbounded cardinality; put them in structured logs or trace attributes with access and retention controls.

Propagate standard trace context across HTTP and messaging. Carry request ID for one synchronous path and workflow or aggregate ID for longer async work. Sample normal traffic, but retain errors and slow traces when feasible. Sampling decisions must be understood when interpreting counts.

## Design

Create a signal plan:

| Question | Signal | Dimensions |
|---|---|---|
| Are users completing checkout? | success ratio | region, client |
| Where is latency spent? | trace spans | service, dependency |
| Are payments unresolved? | unknown counter/age | provider |
| Is work falling behind? | oldest queue age | queue, region |

Use SLO burn-rate alerts over multiple windows. A fast burn catches severe incidents; a slower burn catches sustained degradation without paging on brief noise. Infrastructure thresholds are supporting evidence, not the user-impact objective.

## Code

Structured event:

~~~json
{
  "event": "payment_attempt_finished",
  "request_id": "req_123",
  "trace_id": "4bf92f...",
  "order_id": "ord_456",
  "outcome": "unknown",
  "provider": "provider_a",
  "duration_ms": 842,
  "release": "2026.11.18"
}
~~~

Order ID is acceptable in protected logs but not as a metric label. Never record card data, access tokens, passwords, full personal addresses, or sensitive query strings.

## Deploy

Ship instrumentation with the feature and verify it in staging and canary. Confirm counters change once per event, trace context survives async boundaries, dashboards show the canary release, and alerts route to the correct owner.

Use schema-compatible telemetry changes. Monitor dropped logs, metric export failures, trace sampling, and collector backlog. Telemetry must not block the production request path; apply bounded buffers and drop policy.

Run a game day where an engineer starts from an alert and identifies cause, affected population, mitigation, and recovery evidence.

## Trade-offs

- More telemetry improves diagnosis but costs storage, CPU, network, privacy review, and attention.
- High-cardinality data enables precise search but can overwhelm metric systems.
- Heavy sampling lowers cost but may hide rare failures.
- Long retention supports trends and investigations but expands privacy exposure.
- More alerts increase coverage but reduce trust when they are noisy.
- Client-side signals show full experience but are harder to collect reliably.

Retain evidence according to risk, not “everything forever.”

## Failure modes

- Infrastructure-only dashboards miss user correctness failures.
- Average latency hides tail behavior.
- Unstructured logs cannot be joined or searched reliably.
- Correlation breaks at a queue boundary.
- Sensitive data leaks into logs or span attributes.
- High-cardinality labels overload monitoring.
- Sampling removes the only failed trace.
- Alert thresholds page on harmless work or miss SLO harm.
- Telemetry pipeline failure is invisible.
- A dashboard has no owner or operational question.

Validate signal semantics with fixtures and incident reviews. A misleading metric is worse than a missing one.

## Practice

1. Define two checkout SLIs and one SLO with numerator, denominator, exclusions, window, and target.
2. Design logs and traces for checkout without sensitive or unbounded metric labels.
3. Create an alert and runbook for rising unknown payment outcomes.
4. Audit one dashboard: remove panels that answer no operational question.`,
        vn: `## Phân tích

Observability nối **user impact** với path, state, change và owner bằng signal từ running system. Nó không phải số dashboard. Bắt đầu từ journey outcome rồi đi vào component.

Metric summarize và alert; log giải thích event; trace cho timing và causality. Mỗi signal cần question, bounded dimension, retention, privacy và owner.

## Yêu cầu

SLI cần numerator, denominator, population, exclusion. SLO cần target và window. Với checkout:

- Availability của valid submission.
- Latency tới durable outcome.
- Correctness qua unknown/duplicate payment.
- Freshness qua work age.

Định nghĩa telemetry loss, correlation, sampling, retention và sensitive-data policy. Exclusion không được che harm.

## Tính năng

- **RED**: rate, error, duration.
- **USE**: utilization, saturation, error.
- Business state: accepted, decline, unknown, dedup, reconcile.
- Queue: arrival, completion, oldest age, retry.
- Change: release, region, config, flag.

Journey dashboard đứng trước component dashboard. Alert phải có owner, runbook và action.

## Công nghệ

Metric label chỉ dùng bounded value như region, endpoint, status. User ID, order ID, raw URL là high-cardinality; đặt trong protected structured log hoặc trace.

Propagate trace context qua HTTP và message. Request ID cho sync path; workflow ID cho async work. Sample normal traffic nhưng ưu tiên error và slow trace.

## Thiết kế

| Question | Signal | Dimension |
|---|---|---|
| Checkout có thành công? | success ratio | region, client |
| Latency ở đâu? | trace span | dependency |
| Payment unresolved? | unknown age | provider |
| Queue có lag? | oldest age | queue |

Dùng multi-window SLO burn alert. Infrastructure threshold là evidence hỗ trợ, không phải user objective.

## Code

~~~json
{
  "event": "payment_attempt_finished",
  "request_id": "req_123",
  "trace_id": "4bf92f...",
  "order_id": "ord_456",
  "outcome": "unknown",
  "duration_ms": 842,
  "release": "2026.11.18"
}
~~~

Order ID được phép trong protected log nhưng không trong metric label. Không record card data, token, password hoặc address.

## Deploy

Ship instrumentation cùng feature. Verify counter, async trace context, canary dimension và alert routing. Monitor dropped log, exporter failure và collector backlog. Telemetry không được block request.

Chạy game day từ alert tới cause, affected population, mitigation và recovery evidence.

## Trade-offs

- Nhiều telemetry tăng diagnosis và cost.
- High cardinality tăng precision nhưng overload metric.
- Sampling giảm cost nhưng che rare failure.
- Retention dài tăng privacy exposure.
- Nhiều alert giảm trust khi noisy.
- Client signal đầy đủ hơn nhưng khó thu.

## Phân tích lỗi

- Infra dashboard bỏ correctness.
- Average che tail.
- Unstructured log khó query.
- Correlation mất ở queue.
- Sensitive data leak.
- Cardinality overload.
- Sampling bỏ failed trace.
- Alert noisy hoặc miss SLO.
- Telemetry failure không visible.
- Dashboard không owner.

Metric sai nghĩa còn nguy hiểm hơn thiếu metric.

## Practice

1. Định nghĩa hai SLI và một SLO checkout.
2. Thiết kế log/trace không sensitive label.
3. Tạo alert và runbook cho unknown payment.
4. Audit dashboard và bỏ panel không có operational question.`,
      },
    },
    {
      id: 'system-design-capstone',
      title: { en: 'Capstone design review', vn: 'Capstone review thiết kế' },
      baseline: {
        en: ['Produce a coherent end-to-end diagram', 'Explain trade-offs instead of listing technologies', 'Connect requirements to components and operations'],
        vn: ['Tạo end-to-end diagram mạch lạc', 'Giải thích trade-off thay vì list công nghệ', 'Nối requirement với component và operations'],
      },
      skills: {
        en: ['Lead a structured review with evidence', 'Challenge assumptions, failures, and operating limits', 'Turn findings into decisions and validation work'],
        vn: ['Dẫn structured review bằng evidence', 'Chất vấn assumption, failure và operating limit', 'Biến finding thành decision và validation work'],
      },
      diagram: 'system-design-capstone',
      body: {
        en: `## Analysis

An end-to-end review tests a chain of claims: **requirements justify decisions; estimates size components; contracts connect them; invariants protect correctness; failure analysis defines degradation; signals prove behavior; rollout limits exposure**. A broken link is a finding.

The goal is not the most complicated diagram. It is to find expensive mistakes while change is cheap and create shared understanding across product, engineering, security, and operations. Separate launch blockers from future optimization and personal preference.

The presenter should expose uncertainty rather than defend every choice. Reviewers should challenge assumptions with scenarios and evidence, then help convert unresolved risk into a bounded experiment. A review that produces only comments has failed; the output must be explicit decisions, owners, and measurable verification criteria.

## Requirements

Prepare a concise review packet:

- Actors, journeys, scope, non-goals, and owners.
- Functional requirements and measurable SLOs.
- Expected, peak, and sensitivity estimates.
- Constraints, assumptions, and validation status.
- Data invariants, retention, privacy, and security.
- Recovery objectives and accepted degradation.

Every component and operational mechanism should trace to an approved requirement or demonstrated risk. Every critical requirement should trace to a component, test, metric, and owner.

## Features

For a multi-region checkout platform, cover:

- Cart and checkout acceptance.
- Payment and inventory state machines.
- Order retrieval and fulfillment.
- Idempotent API and compatibility policy.
- Durable events and derived projections.
- Regional routing and failover.
- Operator repair and reconciliation.
- Observability, abuse controls, and audit.

Prioritize the few decisions that control correctness or operating cost. Put supporting detail in an appendix rather than burying reviewers.

## Tech choices

For each major technology, state the decision and rejected alternative:

| Decision | Why | Revisit trigger |
|---|---|---|
| Relational order source | Transactions and uniqueness | Write limit measured |
| Transactional outbox | Avoid unsafe dual write | Shared broker transaction available |
| Single payment writer | Simpler idempotency | Regional RTO missed |
| Async analytics | Isolate checkout | Billing-grade counts required |

“Use Kubernetes, Kafka, and Redis” is not a design argument. Name the requirement, mechanism, operational cost, and evidence.

## Design

Use three diagrams:

1. **Context**: actors, external systems, trust boundaries.
2. **Container**: services, stores, queues, regions, source of truth.
3. **Sequence**: normal and exceptional state transitions.

Walk these scenarios:

- Normal checkout.
- Duplicate request after client timeout.
- Provider accepted payment but response was lost.
- Hot inventory item under a tenfold burst.
- Zone failure and region failure.
- Bad deployment with rollback.
- Queue and telemetry outage.

At every step, identify state read or written, transaction boundary, deadline, idempotency key, authorization decision, and user-visible outcome.

## Code

Capture decisions in a compact record:

~~~yaml
decision: single-writer payments
status: accepted
requirement: no duplicate charge during regional partition
tradeoff: checkout pauses if writer region is unavailable
evidence:
  - provider idempotency contract
  - failover drill under 15 minutes
owner: payments-team
revisit_when: regional RTO exceeds target twice
~~~

Keep diagrams and records in version control. Update them when evidence invalidates an assumption; do not defend historical decisions after their conditions change.

## Deploy

Review the rollout as part of the design:

- Compatible schema and API sequence.
- Canary scope and success criteria.
- Feature flags and configuration ownership.
- Capacity for deploy plus one-zone loss.
- Rollback behavior with newly written data.
- Backfill and reconciliation limits.
- Security review and operator access.

End with a readiness status: **ready**, **conditionally ready**, or **blocked**. Conditional and blocked states need exact exit evidence, owner, and decision date.

## Trade-offs

Classify review feedback:

- Blocker: violates an approved invariant or requirement.
- Reliability risk: plausible failure with unacceptable impact.
- Validation task: critical assumption lacks evidence.
- Optimization: improves cost or performance after launch.
- Preference: an alternative without demonstrated risk reduction.

Do not solve every concern by adding a service, cache, queue, or region. Each component adds capacity, security, deployment, on-call, and incident work.

## Failure modes

Review failure modes include:

- Architecture theater: boxes have no requirement or invariant.
- Happy-path-only walkthrough.
- Reviewers demand preferred tools without evidence.
- Exhaustive minor issues hide the critical decisions.
- Action items lack owner or verification.
- Security, privacy, migration, rollback, or repair is postponed.
- A diagram disagrees with API or data contracts.
- Launch status is vague.
- Assumptions have no measurement plan.

A review is complete only when findings become decisions, owned validation, or explicitly accepted trade-offs.

## Practice

1. Produce a checkout packet limited to ten major decisions.
2. Run a red-team review with duplicate requests, payment timeout, zone loss, hot inventory, telemetry outage, and rollback.
3. Write a final log with three accepted trade-offs, three validation tasks, owners, evidence, and blockers.
4. Remove one component and explain exactly which requirement becomes harder.`,
        vn: `## Phân tích

End-to-end review kiểm tra chain: **requirement justify decision; estimate size component; contract nối chúng; invariant giữ correctness; failure định nghĩa degradation; signal prove behavior; rollout limit exposure**.

Mục tiêu không phải diagram phức tạp nhất mà là tìm expensive mistake sớm và tạo shared understanding. Tách launch blocker khỏi future optimization và preference.

## Yêu cầu

Review packet gồm:

- Actor, journey, scope, non-goal, owner.
- Functional requirement và SLO.
- Expected, peak, sensitivity estimate.
- Constraint, assumption, validation.
- Data invariant, retention, privacy.
- RPO/RTO và accepted degradation.

Mỗi component phải trace tới requirement/risk; mỗi critical requirement trace tới component, test, metric và owner.

## Tính năng

Multi-region checkout cần cart, acceptance, payment, inventory, order, fulfillment, API compatibility, durable event, failover, repair, observability và audit.

Ưu tiên decision điều khiển correctness hoặc operating cost. Supporting detail để appendix.

## Công nghệ

| Decision | Lý do | Revisit |
|---|---|---|
| Relational source | Transaction, uniqueness | Write limit |
| Outbox | Tránh dual write | Shared transaction |
| Single payment writer | Idempotency đơn giản | RTO không đạt |
| Async analytics | Isolate checkout | Billing-grade count |

List technology không phải argument; cần requirement, mechanism, cost và evidence.

## Thiết kế

Dùng context, container và sequence diagram. Walk normal checkout, duplicate, lost payment response, hot inventory, zone/region failure, bad deploy, queue outage.

Ở mỗi step, nêu state, transaction, deadline, idempotency, authorization và user outcome.

## Code

~~~yaml
decision: single-writer payments
status: accepted
requirement: no duplicate charge during partition
tradeoff: checkout pauses if writer region fails
owner: payments-team
revisit_when: regional RTO misses twice
~~~

Lưu decision trong version control và update khi assumption sai.

## Deploy

- Compatible schema/API sequence.
- Canary và success criterion.
- Feature flag ownership.
- Capacity cho deploy và zone loss.
- Rollback với new data.
- Backfill/reconciliation limit.
- Security và operator access.

Kết thúc bằng **ready**, **conditionally ready** hoặc **blocked**, kèm exit evidence, owner, date.

## Trade-offs

Classify feedback thành blocker, reliability risk, validation task, optimization hoặc preference. Preference không được âm thầm block delivery.

Không giải mọi concern bằng thêm service/cache/queue/region; mỗi component tạo on-call và incident work.

## Phân tích lỗi

- Architecture theater.
- Chỉ walk happy path.
- Tool preference thiếu evidence.
- Minor issue che decision lớn.
- Action không owner.
- Hoãn security, migration, rollback.
- Diagram lệch contract.
- Launch status mơ hồ.
- Assumption thiếu measurement.

Review chỉ xong khi finding thành decision, owned validation hoặc accepted trade-off.

## Practice

1. Tạo checkout packet giới hạn mười decision.
2. Red-team duplicate, timeout, zone loss, hot inventory, telemetry outage và rollback.
3. Viết final log có trade-off, validation, owner, evidence, blocker.
4. Bỏ một component và nêu requirement nào khó hơn.`,
      },
    },
  ],
};
