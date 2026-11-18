const fence = '```';

function renderEnglish(spec) {
  const concepts = spec.concepts
    .map(
      (concept, index) => `### ${index + 1}. ${concept.en.name}

${concept.en.detail} Treat this idea as a decision aid, not as a rule that overrides context. Ask which dependency changes, who owns that change, and what evidence would show that this boundary is useful. A pattern earns its place when it localizes a real source of variation and makes the normal path easier to read. If it only renames a function call or creates another file to open, the design has become ceremonial.

For review, state the contract in one sentence and identify both sides of it. Then name one replacement implementation and one failure that should remain contained behind the contract. This small exercise turns an abstract diagram into an operational model that another engineer can challenge.`,
    )
    .join('\n\n');

  const steps = spec.steps
    .map(
      (step, index) => `### Step ${index + 1}: ${step.en.name}

${step.en.detail}

Before moving on, write down the observable result of this step. Separate policy from mechanism: policy explains the product or business choice, while mechanism explains how the program carries it out. Test the policy with a small deterministic example and test the mechanism only at the boundary it controls. During review, trace one successful request and one failure through this step. If either trace requires guessing about hidden mutation, timing, or ownership, simplify the interface before adding another pattern.`,
    )
    .join('\n\n');

  const pitfalls = spec.pitfalls
    .map(
      (pitfall, index) => `### ${index + 1}. ${pitfall.en.name}

${pitfall.en.detail} The warning sign is usually indirection without a corresponding source of change: more interfaces, files, callbacks, or lifecycle rules, but no clearer contract. Measure the trade-off in reviewability, test setup, runtime behavior, and deletion cost. A useful correction is to return to the simplest direct implementation, identify the pressure that made it hurt, and introduce only the boundary that absorbs that pressure.`,
    )
    .join('\n\n');

  const exercises = spec.exercises
    .map(
      (exercise, index) => `### Exercise ${index + 1}: ${exercise.en.name}

${exercise.en.detail}

**Acceptance criteria:** provide a small runnable example or precise pseudocode, one focused test for the normal path, one test for the most important failure, and a short decision note explaining why this pattern is smaller or clearer than a direct alternative. Include a deletion test: describe what you would remove if the expected variation never appears. For an extra challenge, swap one implementation without changing the caller and record which files actually changed.`,
    )
    .join('\n\n');

  return `## Why this matters

${spec.why.en}

The practical question is not “Which pattern can I use?” It is “What change, dependency, or coordination problem keeps making this code expensive?” Mid-level engineers often encounter patterns after a codebase has accumulated wrappers and names borrowed from a catalog. Knowing the names helps communication, but judgment comes from connecting each name to forces: what varies, what must remain stable, where state lives, and who controls the lifecycle. In this lesson, the working context is **${spec.context.en}**. That context is concrete enough to expose costs that a class diagram alone would hide.

The central pressure is **${spec.pressure.en}**. A direct implementation is the baseline, not an embarrassment. Start there and make the pain visible with examples, tests, or change history. Introduce a pattern only when it reduces the total cognitive load for current maintainers. The pattern should make the common path obvious, constrain invalid combinations, and provide a deliberate place for the unstable decision. It should not merely move the same conditional into a file with a famous name.

This distinction matters in production. Patterns affect debugging paths, test seams, deployment risk, performance, and the number of concepts a new teammate must learn. They can reduce coupling, but every boundary also creates navigation and lifecycle costs. Good pattern work therefore includes an exit strategy. You should know how to collapse the abstraction if the variation disappears, and you should be able to explain why the chosen boundary is safer than duplication or a plain function.

Use three kinds of evidence. First, **change evidence**: repeated edits cluster around the same decision. Second, **runtime evidence**: failures, load, or external dependencies require isolation. Third, **team evidence**: people regularly misunderstand ownership or accidentally bypass a rule. ${spec.evidence.en} None of these automatically proves that a catalog pattern is required, but each gives the design conversation something testable instead of aesthetic preference.

## Mental model

Think of a pattern as a named arrangement of responsibilities under pressure. It is not a finished component and it is not a substitute for domain language. A useful mental model has four parts: the force that motivates change, the stable contract callers need, the replaceable or coordinated participants, and the consequences of adding the boundary. Draw those parts before drawing inheritance arrows. Most modern JavaScript and TypeScript implementations use functions, closures, plain objects, modules, and composition; the intent matters more than reproducing a textbook class hierarchy.

For **${spec.title.en}**, use this decision statement: **${spec.decision.en}**. The statement is intentionally conditional. It says when the arrangement helps and implies when not to use it. During design review, challenge every noun. If a “manager,” “handler,” or “service” has no crisp responsibility, the diagram is hiding ambiguity. Prefer names from the product and names that reveal decisions, such as pricePolicy, paymentGateway, retrySchedule, or notificationSubscribers.

${concepts}

### Reading the diagram

The accompanying diagram is a map of responsibility, not a runtime guarantee. Read arrows as dependencies or messages, then annotate ownership and lifetime. Which participant creates each object? Can it be shared safely? Is work synchronous, asynchronous, retryable, or cancelable? What happens when the dependency fails halfway through? These questions prevent a clean-looking diagram from concealing the hardest behavior.

Use the diagram in both directions. Follow a normal request from caller to result, then walk backward from a failure to the component that can diagnose or compensate for it. Mark data that crosses the boundary and keep that data smaller than the implementation behind it. A contract that leaks vendor types, mutable internals, or framework callbacks does not create meaningful independence. It only gives coupling a different spelling.

Finally, compare the patterned design with a direct function. Count concepts rather than lines: public types, runtime objects, configuration branches, lifecycle hooks, and test doubles. The patterned version should win for a stated reason such as independent replacement, stable orchestration, atomic construction, or controlled fan-out. “It may be useful later” is not enough. Future flexibility is valuable only when current evidence identifies the likely axis of change.

## Walkthrough

We will work through **${spec.context.en}**. Begin with the behavior a user or caller observes, not with the pattern name. Define inputs, outputs, failures, and any ordering or consistency guarantee. Then make one design move at a time. This order lets tests protect behavior while structure changes, and it exposes whether each new participant removes a real responsibility from somewhere else.

${steps}

### Reference sketch

${fence}${spec.language}
${spec.code}
${fence}

The sketch is deliberately small. Read it as a boundary experiment, not production infrastructure. Notice where the volatile decision is supplied and where the stable workflow remains visible. Add logging, retries, caching, validation, and metrics only at the participant that owns those concerns. Cross-cutting behavior placed everywhere defeats the pattern because callers once again need to understand implementation details.

Now perform a change simulation. Imagine the requirement described by **${spec.change.en}**. List the files and public contracts that would change in the direct version, then list them in the patterned version. A good boundary narrows the second list without turning configuration into a second programming language. If both lists are identical, the abstraction has not purchased independence. If the patterned list is much larger, the boundary may be in the wrong place.

Perform a failure simulation as well. Force the most important dependency to time out, return malformed data, or reject a request. Decide whether the pattern participant translates the failure, propagates it, retries it, or records compensation. Keep error semantics in the contract: callers need to know whether an operation is idempotent, whether partial work is possible, and whether retrying is safe. A pattern that hides these facts makes the system harder to operate even if it looks decoupled.

Testing should mirror responsibilities. Contract tests describe behavior shared by replaceable implementations. Unit tests cover deterministic policy. Integration tests verify adapters and framework edges with realistic data. A narrow end-to-end test proves that composition is wired correctly. Avoid testing that a mock method was called merely because the implementation currently calls it; assert the meaningful result or boundary message. This keeps tests stable when the internal arrangement changes.

Review the finished flow with a teammate who did not write it. Ask them to point to the stable path, the extension point, the owner of state, and the handling of failure. If the answers require opening every file, reduce indirection or improve names. If the extension point can bypass invariants, narrow the contract. If lifecycle ownership is unclear, move creation to the composition root and pass ready-to-use dependencies inward.

### Operational checklist

Before shipping, answer these questions in writing:

- What exact change is cheaper because of this arrangement?
- Which invariant has one obvious owner?
- What state exists, who owns it, and when is it released?
- Which errors cross the boundary, and in what form?
- Can a new implementation be verified by the same contract tests?
- Can the abstraction be removed without rewriting the domain behavior?

These answers are more valuable than perfect adherence to a catalog diagram. They connect design intent to maintenance. Add the decision statement to a pull request or architecture note, but keep it short enough to become obsolete gracefully. The source code and executable tests remain the primary record.

## Pitfalls & trade-offs

No pattern is free. The most common failure is to optimize for hypothetical extensibility while making present behavior harder to follow. JavaScript makes indirection especially cheap to create: one more callback, object spread, higher-order function, proxy, or module can look harmless. The accumulated cost appears later in stack traces, test setup, bundling boundaries, and lifecycle bugs. Evaluate the whole call path, not each wrapper in isolation.

${pitfalls}

### Trade-off review

Compare the chosen design on five axes: conceptual count, change isolation, runtime transparency, test fidelity, and reversibility. A pattern may score well on isolation but poorly on transparency. That can still be correct for an unstable vendor boundary, but it is probably wrong for a three-line calculation owned by one team. State the sacrifice explicitly. “We accept another interface because two providers change independently” is reviewable; “this is cleaner” is not.

Be cautious with framework-shaped patterns. Dependency injection containers, decorators, event buses, and metaprogramming can obscure creation and control flow. Prefer explicit composition until scale proves that registration machinery pays for itself. Also distinguish domain events from in-process notifications and durable messages. They have different delivery, ordering, retry, and observability requirements even if all are called “events.”

Performance belongs in the trade-off conversation but rarely decides it alone. Measure allocations, listener counts, proxy traps, serialization, and network calls where relevant. More often, operational complexity is the dominant cost: who can inspect registered observers, replay a command, reset a singleton in a test, or identify the concrete strategy selected for a request? Build those answers into names, logs, and composition rather than adding a generic framework.

The final trade-off is organizational. Patterns can create shared vocabulary, but vocabulary can become authority. A reviewer should be able to reject a pattern without being accused of rejecting good design. Keep the discussion attached to observed forces and alternatives. The goal is dependable software that can change, not maximum pattern density.

## Practice / exercises

Practice should include construction, critique, and deletion. Building only the textbook happy path trains recognition but not judgment. For each exercise below, first implement the simplest direct solution. Record the pain you observe. Then add the pattern and compare the number of concepts, changed files, tests, and failure paths. This before-and-after method makes trade-offs visible.

${exercises}

### Reflection prompts

After completing the exercises, write a short review using this template:

1. **Force:** what concrete variation, dependency, or coordination problem existed?
2. **Boundary:** what contract became stable, and for whom?
3. **Consequence:** what became easier, and what became harder?
4. **Evidence:** which test or change simulation supports the choice?
5. **Exit:** under what condition would you remove the pattern?

Pair-review the answer without revealing the pattern name first. If the reviewer can infer the arrangement from the forces and responsibilities, the design is probably grounded. If the only justification is the name, return to the direct implementation. As a final check, explain the solution to someone using domain words only. Pattern vocabulary should compress an already-clear explanation, not replace one.`;
}

function renderVietnamese(spec) {
  const concepts = spec.concepts
    .map(
      (concept, index) => `### ${index + 1}. ${concept.vn.name}

${concept.vn.detail} Hãy xem ý tưởng này như công cụ hỗ trợ quyết định, không phải quy tắc đứng trên bối cảnh. Cần hỏi dependency nào sẽ thay đổi, ai sở hữu thay đổi đó và bằng chứng nào cho thấy boundary này hữu ích. Pattern chỉ đáng tồn tại khi nó cô lập một nguồn biến động có thật và làm đường đi thông thường dễ đọc hơn. Nếu nó chỉ đổi tên một lời gọi hàm hoặc tạo thêm một file phải mở, thiết kế đã trở thành nghi thức.

Khi review, hãy phát biểu contract bằng một câu và xác định rõ hai phía của contract. Sau đó nêu một implementation có thể thay thế và một lỗi cần được giữ bên trong boundary. Bài kiểm tra nhỏ này biến sơ đồ trừu tượng thành mô hình vận hành mà đồng đội có thể phản biện.`,
    )
    .join('\n\n');

  const steps = spec.steps
    .map(
      (step, index) => `### Bước ${index + 1}: ${step.vn.name}

${step.vn.detail}

Trước khi đi tiếp, hãy ghi lại kết quả quan sát được của bước này. Tách policy khỏi mechanism: policy giải thích lựa chọn sản phẩm hoặc nghiệp vụ, còn mechanism giải thích chương trình thực hiện lựa chọn đó như thế nào. Kiểm thử policy bằng ví dụ nhỏ, xác định; chỉ kiểm thử mechanism tại boundary mà nó kiểm soát. Khi review, trace một request thành công và một lỗi qua bước này. Nếu một trong hai trace buộc người đọc phải đoán về mutation ẩn, timing hoặc ownership, hãy làm interface đơn giản hơn trước khi thêm pattern khác.`,
    )
    .join('\n\n');

  const pitfalls = spec.pitfalls
    .map(
      (pitfall, index) => `### ${index + 1}. ${pitfall.vn.name}

${pitfall.vn.detail} Dấu hiệu cảnh báo thường là indirection không đi kèm nguồn thay đổi tương ứng: nhiều interface, file, callback hoặc luật lifecycle hơn nhưng contract không rõ hơn. Hãy đo trade-off bằng khả năng review, công sức dựng test, hành vi runtime và chi phí xóa bỏ. Cách sửa hữu ích là quay về implementation trực tiếp đơn giản nhất, xác định áp lực khiến nó khó chịu rồi chỉ đưa vào boundary hấp thụ đúng áp lực đó.`,
    )
    .join('\n\n');

  const exercises = spec.exercises
    .map(
      (exercise, index) => `### Bài tập ${index + 1}: ${exercise.vn.name}

${exercise.vn.detail}

**Tiêu chí chấp nhận:** cung cấp ví dụ nhỏ chạy được hoặc pseudocode chính xác, một test tập trung cho luồng bình thường, một test cho lỗi quan trọng nhất và một decision note ngắn giải thích vì sao pattern này nhỏ hơn hoặc rõ hơn phương án trực tiếp. Thêm một “deletion test”: mô tả những gì bạn sẽ xóa nếu biến động dự kiến không bao giờ xuất hiện. Phần nâng cao là đổi một implementation mà không sửa caller, rồi ghi lại chính xác những file đã thay đổi.`,
    )
    .join('\n\n');

  return `## Why this matters

${spec.why.vn}

Câu hỏi thực tế không phải “Tôi có thể dùng pattern nào?” mà là “Thay đổi, dependency hay vấn đề phối hợp nào liên tục làm đoạn code này trở nên đắt đỏ?” Kỹ sư tầm trung thường gặp pattern sau khi codebase đã tích lũy wrapper và tên gọi mượn từ catalog. Biết tên giúp giao tiếp, nhưng năng lực phán đoán đến từ việc nối mỗi tên với các lực tác động: điều gì biến đổi, điều gì phải ổn định, state nằm ở đâu và ai kiểm soát lifecycle. Trong bài này, bối cảnh làm việc là **${spec.context.vn}**. Bối cảnh cụ thể này bộc lộ những chi phí mà class diagram đơn thuần thường che giấu.

Áp lực trung tâm là **${spec.pressure.vn}**. Implementation trực tiếp là baseline, không phải điều đáng xấu hổ. Hãy bắt đầu từ đó và làm nỗi đau trở nên nhìn thấy được bằng ví dụ, test hoặc lịch sử thay đổi. Chỉ đưa pattern vào khi nó giảm tổng cognitive load cho người đang bảo trì. Pattern phải làm happy path rõ ràng, hạn chế tổ hợp không hợp lệ và tạo một vị trí có chủ đích cho quyết định dễ thay đổi. Nó không nên chỉ chuyển cùng một câu điều kiện sang file mang tên nổi tiếng.

Điểm khác biệt này rất quan trọng trong production. Pattern tác động đường debug, test seam, rủi ro deploy, hiệu năng và số khái niệm mà thành viên mới phải học. Pattern có thể giảm coupling, nhưng mỗi boundary cũng tăng chi phí điều hướng và lifecycle. Vì vậy, thiết kế pattern tốt luôn có chiến lược thoát. Bạn phải biết cách thu gọn abstraction nếu biến động biến mất và giải thích được vì sao boundary đã chọn an toàn hơn duplication hoặc một hàm thuần túy.

Hãy dùng ba loại bằng chứng. Thứ nhất là **bằng chứng thay đổi**: các chỉnh sửa lặp lại tập trung quanh cùng một quyết định. Thứ hai là **bằng chứng runtime**: lỗi, tải hoặc dependency bên ngoài cần được cô lập. Thứ ba là **bằng chứng đội nhóm**: mọi người thường hiểu sai ownership hoặc vô tình đi vòng qua một rule. ${spec.evidence.vn} Không bằng chứng nào tự động chứng minh cần catalog pattern, nhưng mỗi loại giúp cuộc thảo luận thiết kế dựa trên điều có thể kiểm chứng thay vì sở thích thẩm mỹ.

## Mental model

Hãy xem pattern là một cách sắp xếp trách nhiệm có tên gọi dưới một áp lực cụ thể. Nó không phải component hoàn thiện và không thay thế ngôn ngữ domain. Mental model hữu ích có bốn phần: lực thúc đẩy thay đổi, contract ổn định mà caller cần, các participant có thể thay thế hoặc phối hợp và hệ quả của việc thêm boundary. Vẽ những phần này trước khi vẽ mũi tên inheritance. Phần lớn implementation JavaScript và TypeScript hiện đại dùng function, closure, plain object, module và composition; ý định quan trọng hơn việc sao chép class hierarchy trong sách.

Với **${spec.title.vn}**, hãy dùng phát biểu quyết định: **${spec.decision.vn}**. Câu này có điều kiện một cách có chủ đích. Nó nói khi nào cách sắp xếp hữu ích và ngầm chỉ ra khi nào không nên dùng. Trong design review, hãy thách thức mọi danh từ. Nếu “manager”, “handler” hoặc “service” không có trách nhiệm sắc nét, sơ đồ đang che mơ hồ. Ưu tiên tên gọi từ sản phẩm và tên để lộ quyết định như pricePolicy, paymentGateway, retrySchedule hoặc notificationSubscribers.

${concepts}

### Cách đọc sơ đồ

Sơ đồ đi kèm là bản đồ trách nhiệm, không phải bảo đảm runtime. Đọc mũi tên như dependency hoặc message, sau đó ghi chú ownership và lifetime. Participant nào tạo từng object? Có thể share an toàn không? Công việc synchronous, asynchronous, retryable hay cancelable? Điều gì xảy ra khi dependency lỗi giữa chừng? Các câu hỏi này ngăn một sơ đồ đẹp che mất hành vi khó nhất.

Hãy đọc sơ đồ theo cả hai chiều. Theo một request bình thường từ caller đến kết quả, rồi đi ngược từ lỗi đến component có thể chẩn đoán hoặc bù trừ. Đánh dấu dữ liệu đi qua boundary và giữ dữ liệu đó nhỏ hơn implementation phía sau. Một contract làm rò rỉ vendor type, mutable internal hoặc framework callback không tạo ra độc lập có ý nghĩa; nó chỉ viết coupling theo cách khác.

Cuối cùng, so sánh thiết kế có pattern với một hàm trực tiếp. Đếm khái niệm thay vì đếm dòng: public type, runtime object, nhánh configuration, lifecycle hook và test double. Phiên bản có pattern phải thắng vì một lý do đã nêu như thay thế độc lập, orchestration ổn định, construction nguyên tử hoặc fan-out được kiểm soát. “Có thể hữu ích sau này” là chưa đủ. Flexibility tương lai chỉ có giá trị khi bằng chứng hiện tại chỉ ra trục thay đổi có khả năng xảy ra.

## Walkthrough

Ta sẽ làm việc với **${spec.context.vn}**. Bắt đầu từ hành vi user hoặc caller quan sát được, không bắt đầu bằng tên pattern. Xác định input, output, lỗi và mọi bảo đảm về thứ tự hoặc consistency. Sau đó thực hiện từng thay đổi thiết kế một. Trình tự này để test bảo vệ hành vi trong lúc cấu trúc thay đổi và phơi bày liệu mỗi participant mới có thật sự lấy đi một trách nhiệm từ nơi khác hay không.

${steps}

### Bản phác thảo tham chiếu

${fence}${spec.language}
${spec.code}
${fence}

Bản phác thảo cố ý nhỏ. Hãy đọc nó như thí nghiệm boundary, không phải hạ tầng production. Để ý nơi quyết định dễ biến động được cung cấp và nơi workflow ổn định vẫn nhìn thấy rõ. Chỉ thêm logging, retry, caching, validation và metrics tại participant sở hữu concern tương ứng. Hành vi cross-cutting đặt ở khắp nơi sẽ phá tác dụng của pattern vì caller lại phải hiểu chi tiết implementation.

Bây giờ hãy mô phỏng thay đổi: **${spec.change.vn}**. Liệt kê file và public contract sẽ đổi trong phiên bản trực tiếp, rồi lập danh sách tương tự cho phiên bản có pattern. Boundary tốt làm danh sách thứ hai ngắn hơn mà không biến configuration thành ngôn ngữ lập trình thứ hai. Nếu hai danh sách giống nhau, abstraction chưa mua được tính độc lập. Nếu danh sách có pattern dài hơn nhiều, boundary có thể đang nằm sai chỗ.

Tiếp tục mô phỏng lỗi. Buộc dependency quan trọng nhất timeout, trả dữ liệu sai định dạng hoặc từ chối request. Quyết định participant sẽ translate lỗi, propagate, retry hay ghi nhận compensation. Giữ error semantics trong contract: caller cần biết operation có idempotent không, có thể có partial work không và retry có an toàn không. Pattern che những sự thật này làm hệ thống khó vận hành hơn dù trông decoupled.

Testing phải phản chiếu trách nhiệm. Contract test mô tả hành vi dùng chung cho các implementation có thể thay thế. Unit test bao phủ policy xác định. Integration test xác minh adapter và framework edge bằng dữ liệu thực tế. Một end-to-end test hẹp chứng minh composition được nối đúng. Tránh test rằng mock method được gọi chỉ vì implementation hiện tại gọi nó; hãy assert kết quả hoặc boundary message có ý nghĩa. Cách này giữ test ổn định khi cấu trúc nội bộ đổi.

Review flow hoàn chỉnh với một đồng đội không viết code. Yêu cầu họ chỉ ra stable path, extension point, owner của state và cách xử lý lỗi. Nếu câu trả lời buộc phải mở mọi file, hãy giảm indirection hoặc cải thiện tên. Nếu extension point có thể vượt invariant, hãy thu hẹp contract. Nếu lifecycle ownership chưa rõ, chuyển construction về composition root và truyền dependency sẵn dùng vào trong.

### Checklist vận hành

Trước khi ship, trả lời bằng văn bản:

- Thay đổi chính xác nào rẻ hơn nhờ cách sắp xếp này?
- Invariant nào có một owner hiển nhiên?
- State nào tồn tại, ai sở hữu và khi nào được giải phóng?
- Lỗi nào đi qua boundary và ở dạng gì?
- Implementation mới có thể được xác minh bằng cùng contract test không?
- Có thể xóa abstraction mà không viết lại domain behavior không?

Câu trả lời có giá trị hơn việc tuân thủ hoàn hảo sơ đồ catalog. Chúng nối design intent với maintenance. Có thể thêm decision statement vào pull request hoặc architecture note, nhưng giữ nó đủ ngắn để có thể lỗi thời một cách nhẹ nhàng. Source code và executable test vẫn là hồ sơ chính.

## Pitfalls & trade-offs

Không pattern nào miễn phí. Lỗi phổ biến nhất là tối ưu cho khả năng mở rộng giả định trong khi làm hành vi hiện tại khó theo dõi. JavaScript khiến indirection rất dễ tạo: thêm một callback, object spread, higher-order function, proxy hoặc module đều có vẻ vô hại. Chi phí tích lũy xuất hiện sau trong stack trace, test setup, bundling boundary và lifecycle bug. Hãy đánh giá toàn bộ call path, không đánh giá từng wrapper riêng lẻ.

${pitfalls}

### Review trade-off

So sánh thiết kế trên năm trục: số khái niệm, khả năng cô lập thay đổi, độ minh bạch runtime, độ trung thực của test và tính dễ đảo ngược. Pattern có thể mạnh về isolation nhưng yếu về transparency. Điều đó vẫn đúng cho vendor boundary không ổn định, nhưng có lẽ sai cho phép tính ba dòng do một team sở hữu. Hãy nói rõ sự đánh đổi. “Chấp nhận thêm interface vì hai provider thay đổi độc lập” có thể review; “cách này sạch hơn” thì không.

Cẩn trọng với pattern mang hình dạng framework. Dependency injection container, decorator, event bus và metaprogramming có thể che construction và control flow. Ưu tiên composition tường minh cho đến khi quy mô chứng minh registration machinery đáng giá. Đồng thời cần phân biệt domain event với thông báo in-process và durable message. Chúng có yêu cầu delivery, ordering, retry và observability khác nhau dù đều được gọi là “event”.

Performance thuộc cuộc thảo luận trade-off nhưng hiếm khi quyết định một mình. Đo allocation, listener count, proxy trap, serialization và network call khi phù hợp. Thường thì operational complexity mới là chi phí lớn: ai có thể kiểm tra observer đã đăng ký, replay command, reset singleton trong test hoặc biết strategy cụ thể được chọn cho request? Hãy đưa câu trả lời vào tên, log và composition thay vì thêm generic framework.

Trade-off cuối cùng thuộc tổ chức. Pattern có thể tạo vocabulary chung, nhưng vocabulary có thể trở thành quyền lực. Reviewer phải có thể từ chối pattern mà không bị xem là từ chối thiết kế tốt. Giữ cuộc thảo luận gắn với lực quan sát được và phương án thay thế. Mục tiêu là phần mềm đáng tin cậy, có thể thay đổi, không phải mật độ pattern tối đa.

## Practice / exercises

Thực hành cần bao gồm xây dựng, phản biện và xóa bỏ. Chỉ dựng happy path trong sách sẽ rèn khả năng nhận diện nhưng không rèn phán đoán. Với mỗi bài dưới đây, trước tiên hãy implement giải pháp trực tiếp đơn giản nhất và ghi lại nỗi đau quan sát được. Sau đó thêm pattern rồi so sánh số khái niệm, file thay đổi, test và failure path. Phương pháp trước-sau làm trade-off nhìn thấy được.

${exercises}

### Câu hỏi phản tư

Sau khi hoàn thành bài tập, viết review ngắn theo mẫu:

1. **Force:** biến động, dependency hoặc vấn đề phối hợp cụ thể nào tồn tại?
2. **Boundary:** contract nào trở nên ổn định và ổn định cho ai?
3. **Consequence:** điều gì dễ hơn và điều gì khó hơn?
4. **Evidence:** test hoặc mô phỏng thay đổi nào ủng hộ lựa chọn?
5. **Exit:** trong điều kiện nào bạn sẽ xóa pattern?

Hãy pair-review câu trả lời mà chưa tiết lộ tên pattern. Nếu reviewer có thể suy ra cách sắp xếp từ các lực và trách nhiệm, thiết kế có lẽ đã bám thực tế. Nếu lý do duy nhất là tên gọi, hãy quay lại implementation trực tiếp. Cuối cùng, giải thích giải pháp chỉ bằng từ ngữ domain. Vocabulary pattern phải nén một lời giải thích vốn đã rõ, không được thay thế nó.`;
}

const lessonSpecs = [
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
    why: {
      en: 'Pattern literacy is valuable because teams repeatedly solve similar responsibility and dependency problems. The danger is treating a catalog as a menu of mandatory structures. This lesson establishes a disciplined vocabulary: a pattern records a recurring context, competing forces, an arrangement, and consequences. It never removes the need to understand the domain.',
      vn: 'Hiểu pattern có giá trị vì các team liên tục giải những vấn đề tương tự về trách nhiệm và dependency. Nguy hiểm nằm ở việc xem catalog như thực đơn cấu trúc bắt buộc. Bài này xây dựng vocabulary có kỷ luật: pattern ghi lại bối cảnh lặp lại, các lực cạnh tranh, một cách sắp xếp và hệ quả. Nó không bao giờ thay thế việc hiểu domain.',
    },
    context: {
      en: 'a checkout module whose discount rules, payment provider, and receipt delivery have started changing at different rates',
      vn: 'module checkout nơi discount rule, payment provider và việc gửi receipt bắt đầu thay đổi với tốc độ khác nhau',
    },
    pressure: {
      en: 'the team wants reusable design knowledge without forcing every change through a textbook class hierarchy',
      vn: 'team muốn tái sử dụng tri thức thiết kế mà không ép mọi thay đổi đi qua class hierarchy trong sách',
    },
    evidence: {
      en: 'Here, recent pull requests repeatedly touched checkout conditionals and tests, while incidents showed that payment failures were mixed with receipt failures.',
      vn: 'Trong ví dụ này, các pull request gần đây liên tục sửa conditional và test của checkout, còn incident cho thấy lỗi payment bị trộn với lỗi gửi receipt.',
    },
    decision: {
      en: 'Name and apply a pattern only after the recurring forces and consequences can be demonstrated in the current system.',
      vn: 'Chỉ đặt tên và áp dụng pattern sau khi chứng minh được lực lặp lại và hệ quả trong hệ thống hiện tại.',
    },
    concepts: [
      {
        en: { name: 'Context and forces', detail: 'A pattern begins with a situation and tensions, not a UML shape. In checkout, speed of adding campaigns competes with auditability, while provider independence competes with the simplicity of one direct API call.' },
        vn: { name: 'Bối cảnh và lực tác động', detail: 'Pattern bắt đầu bằng tình huống và các sức căng, không bắt đầu bằng hình UML. Trong checkout, tốc độ thêm campaign cạnh tranh với auditability, còn độc lập provider cạnh tranh với sự đơn giản của một API call trực tiếp.' },
      },
      {
        en: { name: 'Intent and arrangement', detail: 'Intent states the problem solved; arrangement assigns responsibilities that address it. Two implementations can share intent while using classes in one language and plain functions in another. Copy intent before copying structure.' },
        vn: { name: 'Ý định và cách sắp xếp', detail: 'Intent nói vấn đề được giải; arrangement phân công trách nhiệm để xử lý nó. Hai implementation có thể cùng intent nhưng một bên dùng class, bên kia dùng function thuần. Hãy sao chép ý định trước cấu trúc.' },
      },
      {
        en: { name: 'Consequences and limits', detail: 'Every pattern creates benefits and liabilities. An extension point can isolate change, but it also creates navigation, configuration, and testing obligations. The limits are part of the pattern, not footnotes.' },
        vn: { name: 'Hệ quả và giới hạn', detail: 'Mỗi pattern tạo cả lợi ích lẫn nghĩa vụ. Extension point có thể cô lập thay đổi nhưng cũng tăng điều hướng, configuration và trách nhiệm testing. Giới hạn là một phần của pattern, không phải chú thích phụ.' },
      },
    ],
    steps: [
      {
        en: { name: 'Describe behavior directly', detail: 'Write checkout as a short sequence: validate cart, calculate total, charge payment, and request a receipt. Keep it direct long enough to reveal which decisions actually vary. Do not create interfaces merely because nouns appear in the sentence.' },
        vn: { name: 'Mô tả hành vi trực tiếp', detail: 'Viết checkout thành chuỗi ngắn: validate cart, tính total, charge payment và yêu cầu receipt. Giữ cách trực tiếp đủ lâu để lộ ra quyết định thật sự biến đổi. Không tạo interface chỉ vì có danh từ trong câu.' },
      },
      {
        en: { name: 'Collect change evidence', detail: 'Inspect changes and incidents. Mark edits caused by new discount policy separately from edits caused by vendor protocol or delivery reliability. Clusters reveal candidate boundaries more reliably than brainstorming hypothetical subclasses.' },
        vn: { name: 'Thu thập bằng chứng thay đổi', detail: 'Xem lịch sử thay đổi và incident. Đánh dấu riêng edit do discount policy mới, vendor protocol hoặc độ tin cậy khi delivery. Các cụm thay đổi chỉ ra candidate boundary đáng tin hơn việc tưởng tượng subclass.' },
      },
      {
        en: { name: 'Write the force statement', detail: 'State what must remain simple and what must vary independently. For example, checkout order must stay readable while payment providers vary. This sentence becomes a test against unnecessary abstraction.' },
        vn: { name: 'Viết phát biểu lực tác động', detail: 'Nói rõ điều gì phải đơn giản và điều gì phải biến đổi độc lập. Ví dụ, thứ tự checkout phải dễ đọc trong khi payment provider thay đổi. Câu này trở thành phép thử chống abstraction không cần thiết.' },
      },
      {
        en: { name: 'Try the smallest boundary', detail: 'Pass a charge function and keep receipt delivery explicit. Observe whether this isolates the real change. A named Strategy or Adapter may emerge, but the function is enough until additional semantics require more structure.' },
        vn: { name: 'Thử boundary nhỏ nhất', detail: 'Truyền một hàm charge và giữ việc gửi receipt tường minh. Quan sát liệu cách này có cô lập thay đổi thật hay không. Strategy hoặc Adapter có thể xuất hiện sau, nhưng function là đủ cho đến khi semantics đòi hỏi cấu trúc.' },
      },
      {
        en: { name: 'Record consequences', detail: 'Compare changed files, test setup, trace clarity, and failure handling before and after. Keep the pattern only if the improvement outweighs the extra contract and composition work.' },
        vn: { name: 'Ghi lại hệ quả', detail: 'So sánh file thay đổi, test setup, độ rõ của trace và xử lý lỗi trước-sau. Chỉ giữ pattern nếu cải thiện lớn hơn công sức cho contract và composition.' },
      },
    ],
    language: 'ts',
    code: `type Charge = (cents: number) => Promise<{ paymentId: string }>;

async function checkout(total: number, charge: Charge) {
  if (total <= 0) throw new Error('invalid total');
  const payment = await charge(total);
  return { total, paymentId: payment.paymentId };
}`,
    change: {
      en: 'the company adds a second payment provider for one region while checkout ordering must remain unchanged',
      vn: 'công ty thêm payment provider thứ hai cho một region trong khi thứ tự checkout phải giữ nguyên',
    },
    pitfalls: [
      {
        en: { name: 'Pattern spotting', detail: 'Seeing every conditional as Strategy and every constructor as Factory reverses the reasoning process. Similar syntax can represent very different forces.' },
        vn: { name: 'Săn pattern', detail: 'Xem mọi conditional là Strategy và mọi constructor là Factory đã đảo ngược quá trình suy luận. Cú pháp giống nhau có thể đại diện lực rất khác.' },
      },
      {
        en: { name: 'Cargo-cult structure', detail: 'Copying participants from a diagram without their responsibilities produces empty wrappers and anemic interfaces. Preserve intent, then choose structures natural to the language.' },
        vn: { name: 'Sao chép máy móc cấu trúc', detail: 'Chép participant từ sơ đồ mà không có trách nhiệm tương ứng tạo wrapper rỗng và interface nghèo. Giữ intent rồi chọn cấu trúc tự nhiên với ngôn ngữ.' },
      },
      {
        en: { name: 'Pattern as proof of quality', detail: 'A famous name does not prove correctness, modularity, or maintainability. Evidence comes from behavior, tests, change isolation, and operational clarity.' },
        vn: { name: 'Xem pattern là bằng chứng chất lượng', detail: 'Tên nổi tiếng không chứng minh correctness, modularity hay maintainability. Bằng chứng đến từ behavior, test, cô lập thay đổi và độ rõ khi vận hành.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Pattern or plain code', detail: 'Take a function with three shipping conditionals. Produce a direct table-driven version and a Strategy version. Compare likely changes and choose one using explicit evidence.' },
        vn: { name: 'Pattern hay code thuần', detail: 'Lấy function có ba conditional cho shipping. Tạo một phiên bản table-driven trực tiếp và một phiên bản Strategy. So sánh thay đổi có khả năng xảy ra rồi chọn dựa trên bằng chứng.' },
      },
      {
        en: { name: 'Recover the forces', detail: 'Choose one pattern already present in your codebase. Without using its name, document its context, forces, participants, and consequences. Check the explanation against commit history.' },
        vn: { name: 'Khôi phục các lực', detail: 'Chọn một pattern đang có trong codebase. Không dùng tên pattern, hãy ghi bối cảnh, lực, participant và hệ quả. Đối chiếu lời giải thích với commit history.' },
      },
      {
        en: { name: 'Delete a ceremonial abstraction', detail: 'Find or invent an interface with one tiny implementation and no credible replacement pressure. Inline it, compare tests and navigation, and state what evidence would justify restoring it.' },
        vn: { name: 'Xóa abstraction nghi thức', detail: 'Tìm hoặc tạo interface có một implementation nhỏ và không có áp lực thay thế đáng tin. Inline nó, so sánh test và việc điều hướng, rồi nêu bằng chứng nào sẽ biện minh cho việc khôi phục.' },
      },
    ],
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
    why: {
      en: 'SOLID is most useful as a set of questions about change and contracts, not five commandments demanding classes. Patterns give those questions concrete arrangements. This lesson connects the vocabulary while resisting mechanical one-interface-per-class design.',
      vn: 'SOLID hữu ích nhất khi là tập câu hỏi về thay đổi và contract, không phải năm điều răn bắt buộc dùng class. Pattern cung cấp cách sắp xếp cụ thể cho các câu hỏi đó. Bài này nối hai vocabulary nhưng tránh thiết kế máy móc mỗi class một interface.',
    },
    context: {
      en: 'a report-export feature that validates queries, fetches data, formats rows, writes files, and uploads results',
      vn: 'tính năng export report có validate query, lấy dữ liệu, format row, ghi file và upload kết quả',
    },
    pressure: {
      en: 'format and storage integrations evolve independently, while the orchestration must keep consistent authorization and failure semantics',
      vn: 'format và storage integration phát triển độc lập, trong khi orchestration phải giữ authorization và error semantics nhất quán',
    },
    evidence: {
      en: 'Changes to CSV quoting currently risk altering authorization code, and tests replace a large service even when only storage behavior matters.',
      vn: 'Thay đổi CSV quoting hiện có thể ảnh hưởng authorization code, còn test phải thay cả service lớn dù chỉ quan tâm storage behavior.',
    },
    decision: {
      en: 'Use SOLID principles to question responsibility, substitution, and dependency direction; introduce pattern boundaries only where the answers reveal independent change.',
      vn: 'Dùng nguyên lý SOLID để hỏi về trách nhiệm, khả năng thay thế và hướng dependency; chỉ thêm pattern boundary nơi câu trả lời cho thấy thay đổi độc lập.',
    },
    concepts: [
      {
        en: { name: 'Cohesion before single responsibility', detail: 'SRP means one coherent reason to change, not one method per file. Validation and authorization may belong together if the same policy owner changes them; CSV quoting and object storage probably do not.' },
        vn: { name: 'Cohesion trước single responsibility', detail: 'SRP nghĩa là một lý do thay đổi có tính gắn kết, không phải mỗi file một method. Validation và authorization có thể thuộc cùng chỗ nếu cùng policy owner; CSV quoting và object storage có lẽ không.' },
      },
      {
        en: { name: 'Substitution is behavioral', detail: 'LSP and ISP focus attention on promises a caller can rely on. Two exporters that share a type but disagree about empty data, cancellation, or partial files are not truly substitutable.' },
        vn: { name: 'Substitution thuộc hành vi', detail: 'LSP và ISP hướng sự chú ý đến lời hứa caller có thể dựa vào. Hai exporter cùng type nhưng khác quy ước về empty data, cancellation hoặc partial file không thật sự thay thế được.' },
      },
      {
        en: { name: 'Dependency inversion at the volatile edge', detail: 'DIP does not mean abstract everything. Stable orchestration should depend on a small capability contract when a volatile database, formatter, or vendor sits beyond it. Stable local helpers can remain concrete.' },
        vn: { name: 'Dependency inversion tại edge dễ biến động', detail: 'DIP không có nghĩa abstract mọi thứ. Orchestration ổn định nên phụ thuộc capability contract nhỏ khi database, formatter hoặc vendor hay đổi nằm phía sau. Local helper ổn định vẫn có thể concrete.' },
      },
    ],
    steps: [
      {
        en: { name: 'Map reasons to change', detail: 'Annotate the report function with policy owners and external systems. Group lines by why they change, not merely by technical verb. This reveals cohesion and likely seams.' },
        vn: { name: 'Lập bản đồ lý do thay đổi', detail: 'Ghi chú report function bằng policy owner và external system. Nhóm dòng theo lý do chúng đổi, không chỉ theo technical verb. Cách này làm lộ cohesion và seam phù hợp.' },
      },
      {
        en: { name: 'State narrow capabilities', detail: 'Describe formatter and destination contracts in caller language: format rows into bytes; store bytes under a key. Avoid exposing SDK clients, streams, or options the orchestration does not need.' },
        vn: { name: 'Phát biểu capability hẹp', detail: 'Mô tả contract formatter và destination bằng ngôn ngữ caller: format rows thành bytes; lưu bytes dưới key. Tránh lộ SDK client, stream hoặc option orchestration không cần.' },
      },
      {
        en: { name: 'Define behavioral promises', detail: 'Specify empty reports, duplicate keys, cancellation, and errors. Shared signatures are insufficient; contract tests must protect semantics required for substitution.' },
        vn: { name: 'Định nghĩa lời hứa hành vi', detail: 'Quy định empty report, duplicate key, cancellation và error. Chữ ký chung là chưa đủ; contract test phải bảo vệ semantics cần cho substitution.' },
      },
      {
        en: { name: 'Compose concrete implementations', detail: 'Create CSV and JSON formatters plus local and object-storage destinations at the application edge. Keep selection out of the core export workflow.' },
        vn: { name: 'Compose implementation cụ thể', detail: 'Tạo CSV/JSON formatter và local/object-storage destination tại edge của ứng dụng. Giữ việc lựa chọn ra ngoài core export workflow.' },
      },
      {
        en: { name: 'Review principle conflicts', detail: 'Check whether splitting responsibilities increased chatty interfaces or duplicated policy. Principles can pull in different directions; choose the arrangement with the clearest invariants and smallest useful contracts.' },
        vn: { name: 'Review xung đột nguyên lý', detail: 'Kiểm tra việc tách trách nhiệm có làm interface chatty hoặc duplicate policy không. Các nguyên lý có thể kéo ngược chiều; chọn cách có invariant rõ và contract hữu ích nhỏ nhất.' },
      },
    ],
    language: 'ts',
    code: `type Formatter = { format(rows: unknown[]): Uint8Array };
type Destination = { put(key: string, data: Uint8Array): Promise<void> };

async function exportReport(rows: unknown[], key: string, f: Formatter, d: Destination) {
  const bytes = f.format(rows);
  await d.put(key, bytes);
  return { key, bytes: bytes.byteLength };
}`,
    change: {
      en: 'a regulated customer requires encrypted storage but exactly the same report policy and formatter behavior',
      vn: 'một khách hàng regulated yêu cầu encrypted storage nhưng giữ nguyên report policy và formatter behavior',
    },
    pitfalls: [
      {
        en: { name: 'One class, one interface', detail: 'Mechanical interface creation increases names and mocks without creating independent change. Interfaces should describe caller-needed capabilities, not mirror every implementation.' },
        vn: { name: 'Mỗi class một interface', detail: 'Tạo interface máy móc làm tăng tên và mock mà không tạo thay đổi độc lập. Interface phải mô tả capability caller cần, không mirror mọi implementation.' },
      },
      {
        en: { name: 'Open for everything', detail: 'Trying to make every dimension extensible produces configuration matrices and invalid combinations. Open the axis with evidence; keep the rest closed and direct.' },
        vn: { name: 'Mở rộng cho mọi thứ', detail: 'Cố làm mọi chiều extensible tạo ma trận configuration và tổ hợp không hợp lệ. Chỉ mở trục có bằng chứng; giữ phần còn lại đóng và trực tiếp.' },
      },
      {
        en: { name: 'Mock-driven contracts', detail: 'Designing interfaces for convenient mocks can produce contracts no real implementation naturally satisfies. Start from production semantics and use fakes only where they preserve those semantics.' },
        vn: { name: 'Contract bị mock dẫn dắt', detail: 'Thiết kế interface để mock tiện có thể tạo contract implementation thật không tự nhiên đáp ứng. Bắt đầu từ production semantics và chỉ dùng fake khi giữ được semantics đó.' },
      },
    ],
    exercises: [
      {
        en: { name: 'SOLID diagnosis', detail: 'Take a service that reads a database, calculates a score, sends email, and logs analytics. Diagnose it with one question per SOLID principle, then make only the split justified by current change history.' },
        vn: { name: 'Chẩn đoán bằng SOLID', detail: 'Lấy service đọc database, tính score, gửi email và log analytics. Chẩn đoán bằng một câu hỏi cho mỗi nguyên lý SOLID, rồi chỉ tách phần được change history biện minh.' },
      },
      {
        en: { name: 'Contract test substitution', detail: 'Implement an in-memory and filesystem destination. Write one shared contract suite covering overwrite, failure, and byte preservation; fix any semantic mismatch discovered.' },
        vn: { name: 'Contract test cho substitution', detail: 'Implement destination in-memory và filesystem. Viết một contract suite dùng chung bao phủ overwrite, failure và bảo toàn byte; sửa mọi mismatch semantics tìm được.' },
      },
      {
        en: { name: 'Reverse a dependency', detail: 'Refactor orchestration that imports a vendor SDK directly so it accepts a narrow capability. Draw dependency direction before and after and explain why the new boundary is stable.' },
        vn: { name: 'Đảo hướng dependency', detail: 'Refactor orchestration đang import vendor SDK trực tiếp để nhận capability hẹp. Vẽ hướng dependency trước-sau và giải thích vì sao boundary mới ổn định.' },
      },
    ],
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
    why: {
      en: 'Creation becomes a design problem when callers must know concrete variants, construction order, validation, or supporting dependencies. Factory and Builder solve different pressures: Factory chooses and creates a product; Builder accumulates decisions for a complex result. Combining them carelessly creates hidden service locators, so the distinction matters.',
      vn: 'Creation trở thành vấn đề thiết kế khi caller phải biết concrete variant, thứ tự construction, validation hoặc dependency hỗ trợ. Factory và Builder giải hai áp lực khác nhau: Factory chọn và tạo product; Builder tích lũy quyết định cho kết quả phức tạp. Kết hợp cẩu thả sẽ tạo service locator ẩn, vì vậy cần phân biệt.',
    },
    context: {
      en: 'a notification feature that creates email, SMS, or push senders and builds validated multi-channel campaigns',
      vn: 'tính năng notification tạo sender email, SMS hoặc push và dựng campaign đa kênh đã validate',
    },
    pressure: {
      en: 'variant selection must be centralized, while campaign construction has optional steps and cross-field invariants',
      vn: 'việc chọn variant phải tập trung, còn campaign construction có bước tùy chọn và invariant xuyên field',
    },
    evidence: {
      en: 'Callers currently repeat provider switches and occasionally create campaigns with a schedule but no timezone.',
      vn: 'Caller hiện lặp lại switch provider và đôi khi tạo campaign có schedule nhưng thiếu timezone.',
    },
    decision: {
      en: 'Use a Factory for bounded product selection and a Builder when staged construction materially improves validation or readability.',
      vn: 'Dùng Factory cho lựa chọn product hữu hạn và Builder khi construction theo bước cải thiện rõ validation hoặc readability.',
    },
    concepts: [
      {
        en: { name: 'Factory owns selection', detail: 'A factory translates a stable input such as channel configuration into a ready-to-use product. It keeps concrete constructors and dependency wiring out of callers, but it should not become a global registry for unrelated services.' },
        vn: { name: 'Factory sở hữu lựa chọn', detail: 'Factory dịch input ổn định như channel configuration thành product sẵn dùng. Nó giữ concrete constructor và wiring dependency khỏi caller nhưng không nên thành global registry cho service không liên quan.' },
      },
      {
        en: { name: 'Builder owns assembly state', detail: 'A builder names meaningful construction steps and delays final validation until build. It is useful when order, defaults, or cross-field constraints matter; object literals remain better for simple independent options.' },
        vn: { name: 'Builder sở hữu assembly state', detail: 'Builder đặt tên cho bước construction có ý nghĩa và trì hoãn validation cuối đến build. Nó hữu ích khi order, default hoặc cross-field constraint quan trọng; object literal vẫn tốt hơn cho option độc lập đơn giản.' },
      },
      {
        en: { name: 'The composition root owns dependencies', detail: 'Factories and builders should receive provider clients and configuration from the edge. Reaching into global environment or a container hides requirements and makes tests dishonest.' },
        vn: { name: 'Composition root sở hữu dependency', detail: 'Factory và builder nên nhận provider client cùng configuration từ edge. Tự truy cập global environment hoặc container che requirement và làm test thiếu trung thực.' },
      },
    ],
    steps: [
      {
        en: { name: 'Define the product contract', detail: 'Specify send(message) semantics shared by email, SMS, and push, including recipient validation, provider errors, and delivery identifiers. Do this before writing the selection switch.' },
        vn: { name: 'Định nghĩa product contract', detail: 'Quy định semantics send(message) dùng chung cho email, SMS và push, gồm validation recipient, provider error và delivery identifier. Làm việc này trước khi viết selection switch.' },
      },
      {
        en: { name: 'Create an explicit factory', detail: 'Map a closed channel union to constructors and inject concrete clients. Throw a clear configuration error for unsupported values rather than returning undefined or a partially configured sender.' },
        vn: { name: 'Tạo factory tường minh', detail: 'Map channel union đóng sang constructor và inject concrete client. Ném configuration error rõ cho value không hỗ trợ thay vì trả undefined hoặc sender chưa cấu hình đủ.' },
      },
      {
        en: { name: 'Model campaign invariants', detail: 'List required and optional fields. Write rules such as schedule requires timezone and SMS requires a short body. Decide which rules belong to the campaign value versus provider-specific senders.' },
        vn: { name: 'Mô hình hóa campaign invariant', detail: 'Liệt kê field bắt buộc và tùy chọn. Viết rule như schedule cần timezone và SMS cần body ngắn. Quyết định rule nào thuộc campaign value và rule nào thuộc sender cụ thể.' },
      },
      {
        en: { name: 'Add only meaningful builder steps', detail: 'Expose audience, content, channel, and scheduling methods using domain names. Keep intermediate mutable state private and return an immutable validated campaign from build.' },
        vn: { name: 'Chỉ thêm builder step có ý nghĩa', detail: 'Expose method audience, content, channel và scheduling bằng domain name. Giữ mutable state trung gian private và trả campaign immutable đã validate từ build.' },
      },
      {
        en: { name: 'Compose and test boundaries', detail: 'Use the factory after the campaign is built. Test each factory variant, builder invariant, and the orchestration once. Avoid a Cartesian test suite of every builder call order unless order is part of the contract.' },
        vn: { name: 'Compose và test boundary', detail: 'Dùng factory sau khi campaign được build. Test từng factory variant, builder invariant và orchestration một lần. Tránh test Cartesian cho mọi thứ tự builder call trừ khi order thuộc contract.' },
      },
    ],
    language: 'ts',
    code: `type Channel = 'email' | 'sms';
type Sender = { send(text: string): Promise<string> };

function createSender(channel: Channel, deps: { email: Sender; sms: Sender }) {
  return deps[channel];
}

class CampaignBuilder {
  #text = '';
  content(text: string) { this.#text = text; return this; }
  build() {
    if (!this.#text.trim()) throw new Error('content required');
    return Object.freeze({ text: this.#text });
  }
}`,
    change: {
      en: 'the product adds push notifications and a quiet-hours schedule with timezone validation',
      vn: 'sản phẩm thêm push notification và quiet-hours schedule có timezone validation',
    },
    pitfalls: [
      {
        en: { name: 'Factory as service locator', detail: 'A factory that accepts arbitrary names and pulls dependencies from globals hides the dependency graph. Keep product families bounded and inputs typed.' },
        vn: { name: 'Factory thành service locator', detail: 'Factory nhận tên tùy ý rồi kéo dependency từ global sẽ che dependency graph. Giữ product family hữu hạn và input có type.' },
      },
      {
        en: { name: 'Builder for trivial options', detail: 'Fluent syntax can look elegant while making a simple object harder to inspect and serialize. Use an object plus validation when fields are few and independent.' },
        vn: { name: 'Builder cho option tầm thường', detail: 'Fluent syntax có thể đẹp nhưng làm object đơn giản khó inspect và serialize. Dùng object cộng validation khi field ít và độc lập.' },
      },
      {
        en: { name: 'Invalid intermediate products escaping', detail: 'Returning internal builder state or exposing build without final validation lets incomplete values leak. Keep state private and make the built value independent.' },
        vn: { name: 'Rò rỉ product trung gian không hợp lệ', detail: 'Trả internal builder state hoặc build không validation làm value chưa hoàn thiện rò rỉ. Giữ state private và built value độc lập.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Transport factory', detail: 'Build a factory for HTTP, queue, and in-memory transports with one send contract. Inject dependencies explicitly and write contract tests for error translation.' },
        vn: { name: 'Transport factory', detail: 'Dựng factory cho HTTP, queue và in-memory transport với một contract send. Inject dependency tường minh và viết contract test cho error translation.' },
      },
      {
        en: { name: 'Query builder with invariants', detail: 'Create a report query builder where a date range is required, grouping is optional, and comparison requires a matching prior range. Return an immutable query.' },
        vn: { name: 'Query builder có invariant', detail: 'Tạo report query builder cần date range, grouping tùy chọn và comparison cần prior range tương ứng. Trả query immutable.' },
      },
      {
        en: { name: 'Remove an unnecessary builder', detail: 'Implement a three-option configuration with both an object literal and a builder. Compare discoverability, validation, serialization, and deletion cost; select the smaller honest design.' },
        vn: { name: 'Xóa builder không cần thiết', detail: 'Implement configuration ba option bằng object literal và builder. So sánh discoverability, validation, serialization và deletion cost; chọn thiết kế nhỏ và trung thực hơn.' },
      },
    ],
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
    why: {
      en: 'Singleton is easy to implement in module systems and hard to reason about once it owns mutable state, credentials, connections, or request context. “Only one” and “available everywhere” are separate decisions. This lesson focuses on lifecycle, concurrency, and testing so that convenience does not become invisible coupling.',
      vn: 'Singleton dễ implement trong module system nhưng khó suy luận khi nó sở hữu mutable state, credential, connection hoặc request context. “Chỉ một instance” và “có mặt mọi nơi” là hai quyết định riêng. Bài này tập trung lifecycle, concurrency và testing để sự tiện lợi không thành coupling vô hình.',
    },
    context: {
      en: 'a server application that needs a database pool, configuration snapshot, logger, and per-request user context',
      vn: 'server application cần database pool, configuration snapshot, logger và user context theo từng request',
    },
    pressure: {
      en: 'some resources should be created once per process, but global access would hide dependencies and mix lifetimes',
      vn: 'một số resource nên tạo một lần mỗi process, nhưng global access sẽ che dependency và trộn lifetime',
    },
    evidence: {
      en: 'Tests currently influence one another through cached configuration, and request identity has accidentally leaked between concurrent operations.',
      vn: 'Test hiện ảnh hưởng nhau qua configuration cache, và request identity từng rò rỉ giữa các operation concurrent.',
    },
    decision: {
      en: 'Prefer one explicitly owned instance passed to consumers; use global singleton access only for truly process-wide, stateless or carefully controlled resources.',
      vn: 'Ưu tiên một instance có owner rõ được truyền cho consumer; chỉ dùng global singleton access cho resource thật sự process-wide, stateless hoặc được kiểm soát kỹ.',
    },
    concepts: [
      {
        en: { name: 'Cardinality is not access', detail: 'A composition root can create one pool and pass it explicitly. That preserves single cardinality without allowing every module to fetch hidden state. The distinction improves tests and lifecycle control.' },
        vn: { name: 'Cardinality không phải access', detail: 'Composition root có thể tạo một pool rồi truyền tường minh. Cách này giữ cardinality bằng một mà không cho mọi module tự lấy hidden state. Phân biệt này cải thiện test và lifecycle.' },
      },
      {
        en: { name: 'Lifetime must match responsibility', detail: 'Process configuration, request identity, transaction state, and cached domain data have different lifetimes. Putting them behind one singleton object creates stale reads and concurrency hazards.' },
        vn: { name: 'Lifetime phải khớp trách nhiệm', detail: 'Process configuration, request identity, transaction state và cached domain data có lifetime khác nhau. Đưa chúng sau một singleton object tạo stale read và concurrency hazard.' },
      },
      {
        en: { name: 'Initialization and disposal are contracts', detail: 'Lazy initialization needs concurrency semantics and failure behavior. Eager initialization needs startup ordering. Pools, watchers, and timers also need deterministic shutdown; a getInstance method does not solve that.' },
        vn: { name: 'Initialization và disposal là contract', detail: 'Lazy initialization cần concurrency semantics và failure behavior. Eager initialization cần startup ordering. Pool, watcher và timer cũng cần shutdown xác định; getInstance không giải quyết điều đó.' },
      },
    ],
    steps: [
      {
        en: { name: 'Classify lifetimes', detail: 'List each candidate resource and label it process, worker, request, session, or operation scoped. Reject singleton for any value whose correct lifetime is narrower than the host process.' },
        vn: { name: 'Phân loại lifetime', detail: 'Liệt kê từng resource candidate và gắn nhãn process, worker, request, session hoặc operation scoped. Loại singleton cho mọi value có lifetime đúng hẹp hơn host process.' },
      },
      {
        en: { name: 'Choose the owner', detail: 'Make application startup create the database pool and logger. Keep handles in an application context owned by startup, not in a utility imported from arbitrary domain modules.' },
        vn: { name: 'Chọn owner', detail: 'Để application startup tạo database pool và logger. Giữ handle trong application context do startup sở hữu, không để trong utility được import tùy ý từ domain module.' },
      },
      {
        en: { name: 'Pass capabilities explicitly', detail: 'Give handlers the narrow database and logging capabilities they use. This reveals dependencies and lets tests supply controlled implementations without resetting module caches.' },
        vn: { name: 'Truyền capability tường minh', detail: 'Cấp cho handler database và logging capability hẹp mà nó dùng. Cách này lộ dependency và cho test cung cấp implementation kiểm soát được mà không reset module cache.' },
      },
      {
        en: { name: 'Protect one-time initialization', detail: 'If lazy creation is required, cache the initialization promise rather than only the completed value so concurrent callers share success or failure. Define whether a failed initialization may retry.' },
        vn: { name: 'Bảo vệ initialization một lần', detail: 'Nếu cần lazy creation, cache initialization promise thay vì chỉ completed value để concurrent caller chia sẻ success hoặc failure. Quy định initialization lỗi có được retry không.' },
      },
      {
        en: { name: 'Close deterministically', detail: 'Register shutdown ownership near creation. Tests should create and close their own application context; production should react to termination signals without allowing new work during drain.' },
        vn: { name: 'Đóng một cách xác định', detail: 'Đăng ký shutdown ownership gần nơi creation. Test tự tạo và đóng application context; production phản ứng termination signal và không nhận work mới trong lúc drain.' },
      },
    ],
    language: 'ts',
    code: `type AppContext = {
  db: { query(sql: string): Promise<unknown> };
  close(): Promise<void>;
};

async function createAppContext(): Promise<AppContext> {
  const db = await createPool();
  return { db, close: () => db.end() };
}

// Startup creates one context; handlers receive it explicitly.`,
    change: {
      en: 'tests must run in parallel with different databases and the server must drain pools during zero-downtime deployment',
      vn: 'test phải chạy parallel với database khác nhau và server phải drain pool trong zero-downtime deployment',
    },
    pitfalls: [
      {
        en: { name: 'Request data in process globals', detail: 'Current user, locale, transaction, and trace data are concurrent-context values. A mutable singleton makes one request overwrite another.' },
        vn: { name: 'Request data trong process global', detail: 'Current user, locale, transaction và trace data là concurrent-context value. Mutable singleton khiến request này ghi đè request khác.' },
      },
      {
        en: { name: 'Hidden import-time side effects', detail: 'Opening connections during module import makes startup order, errors, tests, and hot reload difficult to control. Prefer explicit async creation.' },
        vn: { name: 'Import-time side effect bị ẩn', detail: 'Mở connection lúc module import làm startup order, error, test và hot reload khó kiểm soát. Ưu tiên async creation tường minh.' },
      },
      {
        en: { name: 'Reset methods for tests', detail: 'A public resetSingleton method is evidence that ownership is wrong. It adds production surface and still fails under parallel tests.' },
        vn: { name: 'Reset method dành cho test', detail: 'Public resetSingleton method là bằng chứng ownership sai. Nó tăng production surface và vẫn lỗi dưới parallel test.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Replace global configuration', detail: 'Refactor a module that reads and caches environment variables globally. Parse configuration once at startup, pass a frozen value, and test two configurations concurrently.' },
        vn: { name: 'Thay global configuration', detail: 'Refactor module đọc và cache environment variable global. Parse configuration một lần lúc startup, truyền value frozen và test hai configuration concurrent.' },
      },
      {
        en: { name: 'Safe lazy resource', detail: 'Implement lazy initialization that caches a promise, handles concurrent callers, and defines retry after rejection. Add deterministic close and tests for both paths.' },
        vn: { name: 'Lazy resource an toàn', detail: 'Implement lazy initialization cache promise, xử lý concurrent caller và quy định retry sau rejection. Thêm close xác định và test cả hai path.' },
      },
      {
        en: { name: 'Lifetime audit', detail: 'Audit logger, pool, cache, user context, feature flags, and transaction in a sample service. Assign scopes and justify which, if any, may be globally accessible.' },
        vn: { name: 'Audit lifetime', detail: 'Audit logger, pool, cache, user context, feature flag và transaction trong service mẫu. Gán scope và biện minh thành phần nào, nếu có, được global access.' },
      },
    ],
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
    why: {
      en: 'Adapter and Facade both wrap things, but their intent differs. Adapter makes an incompatible interface fit a contract; Facade offers a simpler entry point to a complicated subsystem. Knowing which pressure exists prevents wrappers that merely rename methods while leaking all vendor or subsystem complexity.',
      vn: 'Adapter và Facade đều wrap thứ khác nhưng intent khác nhau. Adapter làm interface không tương thích khớp contract; Facade cung cấp entry point đơn giản cho subsystem phức tạp. Phân biệt đúng áp lực giúp tránh wrapper chỉ đổi tên method nhưng vẫn rò toàn bộ complexity.',
    },
    context: {
      en: 'an order service integrating a payment vendor SDK and coordinating inventory, payment, shipment, and receipt subsystems',
      vn: 'order service tích hợp payment vendor SDK và phối hợp inventory, payment, shipment cùng receipt subsystem',
    },
    pressure: {
      en: 'vendor shapes and errors must not contaminate the domain, while callers need one safe use-case-level operation',
      vn: 'vendor shape và error không được làm bẩn domain, trong khi caller cần một operation mức use case an toàn',
    },
    evidence: {
      en: 'Vendor response objects appear in domain tests, and controllers duplicate the same reserve-charge-ship sequence with inconsistent rollback.',
      vn: 'Vendor response object xuất hiện trong domain test, còn controller lặp chuỗi reserve-charge-ship với rollback không nhất quán.',
    },
    decision: {
      en: 'Use Adapter at compatibility boundaries and Facade at subsystem entry points; keep each contract in the language of its caller.',
      vn: 'Dùng Adapter tại compatibility boundary và Facade tại entry point của subsystem; giữ mỗi contract bằng ngôn ngữ caller.',
    },
    concepts: [
      {
        en: { name: 'Adapter translates contracts', detail: 'A payment adapter converts money units, idempotency keys, status codes, and vendor errors into domain concepts. Translation includes behavior, not only field names.' },
        vn: { name: 'Adapter dịch contract', detail: 'Payment adapter chuyển money unit, idempotency key, status code và vendor error thành domain concept. Translation gồm cả behavior, không chỉ field name.' },
      },
      {
        en: { name: 'Facade presents use cases', detail: 'An order facade exposes placeOrder rather than every subsystem method. It owns orchestration order and compensation policy while delegating specialized work.' },
        vn: { name: 'Facade trình bày use case', detail: 'Order facade expose placeOrder thay vì mọi subsystem method. Nó sở hữu orchestration order và compensation policy trong khi delegate công việc chuyên biệt.' },
      },
      {
        en: { name: 'Boundaries control leakage', detail: 'Domain code should not import vendor SDK types or know subsystem topology. Small boundary DTOs and domain errors keep replacement and testing realistic.' },
        vn: { name: 'Boundary kiểm soát leakage', detail: 'Domain code không nên import vendor SDK type hoặc biết topology subsystem. Boundary DTO nhỏ và domain error giúp replacement cùng testing thực tế.' },
      },
    ],
    steps: [
      {
        en: { name: 'Write the caller contract', detail: 'Define charge with domain money, order identity, and meaningful outcomes. Include idempotency and decline semantics before opening the vendor documentation.' },
        vn: { name: 'Viết caller contract', detail: 'Định nghĩa charge bằng domain money, order identity và outcome có ý nghĩa. Bao gồm idempotency và decline semantics trước khi mở vendor documentation.' },
      },
      {
        en: { name: 'Translate at one edge', detail: 'Implement the adapter mapping cents, request fields, statuses, and exceptions. Preserve diagnostic cause internally while returning errors the domain can act on.' },
        vn: { name: 'Dịch tại một edge', detail: 'Implement adapter map cents, request field, status và exception. Giữ diagnostic cause bên trong trong khi trả error domain có thể hành động.' },
      },
      {
        en: { name: 'Define the use-case facade', detail: 'Expose placeOrder(input) with a result meaningful to controller and job consumers. Keep inventory, payment, shipment, and receipt handles private.' },
        vn: { name: 'Định nghĩa use-case facade', detail: 'Expose placeOrder(input) với result có nghĩa cho controller và job consumer. Giữ inventory, payment, shipment và receipt handle private.' },
      },
      {
        en: { name: 'Make compensation explicit', detail: 'Specify what happens when payment succeeds but shipment creation fails. The facade coordinates release, refund, retry, or durable follow-up according to business policy.' },
        vn: { name: 'Làm compensation tường minh', detail: 'Quy định điều xảy ra khi payment thành công nhưng tạo shipment lỗi. Facade phối hợp release, refund, retry hoặc durable follow-up theo business policy.' },
      },
      {
        en: { name: 'Test both boundaries', detail: 'Contract-test the adapter against realistic vendor fixtures and unit-test facade orchestration with capability fakes. Keep one integration path proving real wiring and serialization.' },
        vn: { name: 'Test cả hai boundary', detail: 'Contract-test adapter với vendor fixture thực tế và unit-test facade orchestration bằng capability fake. Giữ một integration path chứng minh wiring và serialization thật.' },
      },
    ],
    language: 'ts',
    code: `type Payment = { charge(orderId: string, cents: number): Promise<string> };

function paymentAdapter(sdk: VendorSdk): Payment {
  return {
    async charge(orderId, cents) {
      const r = await sdk.createPayment({ reference: orderId, amount: cents });
      if (r.status !== 'approved') throw new PaymentDeclined(orderId);
      return r.id;
    },
  };
}`,
    change: {
      en: 'the payment vendor releases a new SDK while mobile and web callers must keep the same place-order contract',
      vn: 'payment vendor phát hành SDK mới trong khi mobile và web caller phải giữ nguyên place-order contract',
    },
    pitfalls: [
      {
        en: { name: 'Leaky adapter', detail: 'Returning vendor enums, pagination objects, or exceptions forces domain code to understand the dependency. Translate semantics completely at the edge.' },
        vn: { name: 'Adapter bị leak', detail: 'Trả vendor enum, pagination object hoặc exception buộc domain hiểu dependency. Hãy dịch semantics đầy đủ tại edge.' },
      },
      {
        en: { name: 'God facade', detail: 'A facade that collects unrelated use cases and state becomes a new monolith. Scope facades around a cohesive subsystem or workflow.' },
        vn: { name: 'God facade', detail: 'Facade gom use case và state không liên quan sẽ thành monolith mới. Giới hạn facade quanh subsystem hoặc workflow cohesive.' },
      },
      {
        en: { name: 'Pass-through wrapper', detail: 'A wrapper with identical methods and types adds navigation without adaptation or simplification. Remove it unless it owns a concrete boundary policy.' },
        vn: { name: 'Pass-through wrapper', detail: 'Wrapper có method và type giống hệt chỉ tăng điều hướng mà không adaptation hay simplification. Xóa nó trừ khi sở hữu boundary policy cụ thể.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Currency adapter', detail: 'Adapt a provider that accepts decimal strings to a domain contract using integer minor units. Handle unsupported currency, rounding refusal, decline, and timeout.' },
        vn: { name: 'Currency adapter', detail: 'Adapt provider nhận decimal string sang domain contract dùng integer minor unit. Xử lý unsupported currency, từ chối rounding, decline và timeout.' },
      },
      {
        en: { name: 'Media facade', detail: 'Build a facade for upload, virus scan, thumbnail generation, and metadata persistence. Define partial failure and cleanup behavior explicitly.' },
        vn: { name: 'Media facade', detail: 'Dựng facade cho upload, virus scan, thumbnail generation và lưu metadata. Định nghĩa rõ partial failure và cleanup behavior.' },
      },
      {
        en: { name: 'Leakage audit', detail: 'Search a sample domain module for vendor imports and external DTOs. Move one translation to an adapter and measure how tests and replacement change.' },
        vn: { name: 'Audit leakage', detail: 'Tìm vendor import và external DTO trong domain module mẫu. Chuyển một translation sang adapter rồi đo thay đổi trong test và khả năng replacement.' },
      },
    ],
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
    why: {
      en: 'Decorator and Proxy can look identical in code because both delegate to another object. Their intent separates them: Decorator adds composable behavior; Proxy controls access to a subject because of location, cost, security, or lifecycle. Correct intent clarifies ordering, transparency, and failure semantics.',
      vn: 'Decorator và Proxy có thể trông giống hệt trong code vì đều delegate sang object khác. Intent phân biệt chúng: Decorator thêm behavior có thể compose; Proxy kiểm soát access đến subject vì location, cost, security hoặc lifecycle. Intent đúng làm rõ ordering, transparency và failure semantics.',
    },
    context: {
      en: 'a document repository that needs metrics, retries, caching, authorization, and remote access without burying the core storage implementation',
      vn: 'document repository cần metrics, retry, caching, authorization và remote access mà không chôn core storage implementation',
    },
    pressure: {
      en: 'cross-cutting behaviors should compose predictably, while expensive or protected access needs an explicit gate',
      vn: 'cross-cutting behavior phải compose dễ đoán, còn access đắt hoặc được bảo vệ cần gate tường minh',
    },
    evidence: {
      en: 'Storage methods currently duplicate timers and retry loops, while controllers inconsistently enforce authorization before remote reads.',
      vn: 'Storage method hiện duplicate timer và retry loop, còn controller enforce authorization không nhất quán trước remote read.',
    },
    decision: {
      en: 'Use Decorator to add orthogonal behavior around a stable contract and Proxy to represent controlled access; document ordering and semantic differences.',
      vn: 'Dùng Decorator để thêm behavior độc lập quanh contract ổn định và Proxy để biểu diễn controlled access; ghi rõ ordering và khác biệt semantics.',
    },
    concepts: [
      {
        en: { name: 'Decorator forms a behavior pipeline', detail: 'Each decorator preserves the repository contract while adding one concern such as metrics or retry. Composition order matters because retry outside metrics measures attempts differently from metrics outside retry.' },
        vn: { name: 'Decorator tạo behavior pipeline', detail: 'Mỗi decorator giữ repository contract trong khi thêm một concern như metrics hoặc retry. Thứ tự compose quan trọng vì retry ngoài metrics đo attempt khác metrics ngoài retry.' },
      },
      {
        en: { name: 'Proxy represents access policy', detail: 'A remote, virtual, or protection proxy decides whether and how the real subject is reached. It may delay creation, cross a network, or reject access, so perfect transparency is often impossible.' },
        vn: { name: 'Proxy biểu diễn access policy', detail: 'Remote, virtual hoặc protection proxy quyết định subject thật có được truy cập và truy cập thế nào. Nó có thể trì hoãn creation, đi qua network hoặc từ chối access nên transparency hoàn hảo thường không thể.' },
      },
      {
        en: { name: 'Contract semantics include side effects', detail: 'Wrappers must preserve cancellation, idempotency, consistency, and error meaning. Matching method signatures while changing these guarantees violates substitutability.' },
        vn: { name: 'Contract semantics gồm side effect', detail: 'Wrapper phải giữ cancellation, idempotency, consistency và ý nghĩa error. Cùng method signature nhưng đổi các bảo đảm này sẽ vi phạm substitutability.' },
      },
    ],
    steps: [
      {
        en: { name: 'Stabilize the subject contract', detail: 'Define get and put behavior including not-found, version, cancellation, and consistency. Cross-cutting wrappers need a trustworthy base contract.' },
        vn: { name: 'Ổn định subject contract', detail: 'Định nghĩa behavior get và put gồm not-found, version, cancellation và consistency. Cross-cutting wrapper cần base contract đáng tin.' },
      },
      {
        en: { name: 'Build one-purpose decorators', detail: 'Create metrics and retry wrappers separately. Delegate all unrelated behavior and ensure retry is limited to classified transient, idempotent operations.' },
        vn: { name: 'Dựng decorator một mục đích', detail: 'Tạo metrics và retry wrapper riêng. Delegate mọi behavior không liên quan và chỉ retry operation transient, idempotent đã phân loại.' },
      },
      {
        en: { name: 'Choose and test ordering', detail: 'Compose wrappers at startup. Decide whether metrics observe logical operations or individual attempts, and whether cache hits require authorization checks.' },
        vn: { name: 'Chọn và test ordering', detail: 'Compose wrapper lúc startup. Quyết định metrics quan sát logical operation hay từng attempt, và cache hit có cần authorization check không.' },
      },
      {
        en: { name: 'Introduce the access proxy', detail: 'Put authorization and remote translation at the controlled boundary. Pass actor context explicitly and return domain errors rather than network details.' },
        vn: { name: 'Thêm access proxy', detail: 'Đặt authorization và remote translation tại controlled boundary. Truyền actor context tường minh và trả domain error thay vì network detail.' },
      },
      {
        en: { name: 'Trace success and failure', detail: 'Trace cache hit, cache miss, denied access, transient failure, and cancellation through the full chain. Add observability that identifies the concrete chain without exposing secrets.' },
        vn: { name: 'Trace success và failure', detail: 'Trace cache hit, cache miss, denied access, transient failure và cancellation qua toàn chain. Thêm observability nhận diện concrete chain mà không lộ secret.' },
      },
    ],
    language: 'ts',
    code: `type Store = { get(id: string): Promise<string> };

const withMetrics = (inner: Store, timing: (ms: number) => void): Store => ({
  async get(id) {
    const start = performance.now();
    try { return await inner.get(id); }
    finally { timing(performance.now() - start); }
  },
});`,
    change: {
      en: 'the service adds tenant authorization and caching while operations teams need latency for both logical requests and remote attempts',
      vn: 'service thêm tenant authorization và caching trong khi ops cần latency cho cả logical request lẫn remote attempt',
    },
    pitfalls: [
      {
        en: { name: 'Wrapper-order accidents', detail: 'Changing order can bypass authorization on cache hits, multiply logs, or retry non-idempotent writes. Make the chain explicit and test its semantics.' },
        vn: { name: 'Tai nạn do thứ tự wrapper', detail: 'Đổi thứ tự có thể bypass authorization khi cache hit, nhân log hoặc retry write không idempotent. Làm chain tường minh và test semantics.' },
      },
      {
        en: { name: 'False transparency', detail: 'A remote proxy has latency and partial failure absent from a local object. Contracts and names should reveal those operational realities.' },
        vn: { name: 'Transparency giả', detail: 'Remote proxy có latency và partial failure mà local object không có. Contract và tên phải để lộ thực tế vận hành đó.' },
      },
      {
        en: { name: 'Decorator explosion', detail: 'Many tiny wrappers create deep stack traces and configuration puzzles. Combine concerns that share ownership and always deploy together, but do not create a generic middleware framework prematurely.' },
        vn: { name: 'Bùng nổ decorator', detail: 'Nhiều wrapper nhỏ tạo stack trace sâu và configuration khó hiểu. Gộp concern cùng ownership luôn deploy chung, nhưng đừng vội tạo generic middleware framework.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Ordered repository chain', detail: 'Compose authorization, cache, retry, and metrics around a repository. State and test the intended ordering for hits, misses, denial, and transient errors.' },
        vn: { name: 'Repository chain có thứ tự', detail: 'Compose authorization, cache, retry và metrics quanh repository. Nêu và test ordering dự kiến cho hit, miss, denial và transient error.' },
      },
      {
        en: { name: 'Virtual proxy', detail: 'Create a proxy that initializes an expensive parser on first use. Handle concurrent first calls and initialization failure without constructing twice.' },
        vn: { name: 'Virtual proxy', detail: 'Tạo proxy initialize parser đắt ở lần dùng đầu. Xử lý concurrent first call và initialization failure mà không construct hai lần.' },
      },
      {
        en: { name: 'Semantic audit', detail: 'Given two wrappers with matching TypeScript types, inspect whether they preserve cancellation, error identity, ordering, and idempotency. Repair one semantic violation.' },
        vn: { name: 'Audit semantics', detail: 'Với hai wrapper cùng TypeScript type, kiểm tra chúng có giữ cancellation, error identity, ordering và idempotency không. Sửa một semantic violation.' },
      },
    ],
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
    why: {
      en: 'Strategy and Observer address different behavioral pressures. Strategy selects one interchangeable policy for a decision; Observer informs zero or more interested parties after something happens. They often meet in real workflows, and confusing them can turn policy selection into uncontrolled event choreography.',
      vn: 'Strategy và Observer xử lý hai áp lực behavior khác nhau. Strategy chọn một policy thay thế được cho quyết định; Observer thông báo cho không hoặc nhiều bên quan tâm sau khi sự việc xảy ra. Chúng thường gặp nhau trong workflow thật, và nhầm lẫn có thể biến policy selection thành event choreography mất kiểm soát.',
    },
    context: {
      en: 'a pricing service that selects discount policy and notifies analytics, loyalty, and audit consumers when an order is priced',
      vn: 'pricing service chọn discount policy và thông báo analytics, loyalty cùng audit consumer khi order được định giá',
    },
    pressure: {
      en: 'pricing rules must be selected deterministically, while secondary reactions should evolve without editing the pricing workflow',
      vn: 'pricing rule phải được chọn xác định, còn phản ứng phụ cần phát triển mà không sửa pricing workflow',
    },
    evidence: {
      en: 'A growing discount switch mixes campaign policy, and direct calls to three downstream systems make pricing fail when analytics is unavailable.',
      vn: 'Discount switch ngày càng lớn trộn campaign policy, còn lời gọi trực tiếp tới ba downstream system khiến pricing lỗi khi analytics unavailable.',
    },
    decision: {
      en: 'Use Strategy for one selected policy and Observer for post-fact fan-out; make selection and delivery guarantees explicit.',
      vn: 'Dùng Strategy cho một policy được chọn và Observer cho fan-out sau sự kiện; làm rõ selection và delivery guarantee.',
    },
    concepts: [
      {
        en: { name: 'Strategy is a policy seam', detail: 'A strategy receives the information needed for one decision and returns a result under a shared contract. Selection belongs at a higher level and should be observable for debugging.' },
        vn: { name: 'Strategy là policy seam', detail: 'Strategy nhận thông tin cần cho một quyết định và trả result theo contract chung. Selection thuộc level cao hơn và phải observable để debug.' },
      },
      {
        en: { name: 'Observer is a dependency inversion for reactions', detail: 'The subject publishes a meaningful fact without importing every reaction. Subscribers own their work, but the publisher still needs a delivery and failure policy.' },
        vn: { name: 'Observer đảo dependency cho phản ứng', detail: 'Subject publish fact có ý nghĩa mà không import mọi reaction. Subscriber sở hữu công việc của mình, nhưng publisher vẫn cần delivery và failure policy.' },
      },
      {
        en: { name: 'Events are facts, not remote commands', detail: 'OrderPriced describes completed domain behavior. “SendLoyaltyEmailNow” dictates another component’s action and couples the publisher to that workflow.' },
        vn: { name: 'Event là fact, không phải remote command', detail: 'OrderPriced mô tả domain behavior đã hoàn tất. “SendLoyaltyEmailNow” ra lệnh action cho component khác và coupling publisher với workflow đó.' },
      },
    ],
    steps: [
      {
        en: { name: 'Extract pricing inputs and output', detail: 'Define a PriceContext and PriceQuote with money, applied adjustments, and explanation. Keep strategies pure where possible so selection tests remain deterministic.' },
        vn: { name: 'Tách pricing input và output', detail: 'Định nghĩa PriceContext và PriceQuote gồm money, adjustment đã áp dụng và explanation. Giữ strategy pure khi có thể để selection test xác định.' },
      },
      {
        en: { name: 'Implement bounded strategies', detail: 'Create standard, campaign, and loyalty policies under the same behavioral rules. Do not let each strategy fetch arbitrary data; prepare context before selection.' },
        vn: { name: 'Implement strategy hữu hạn', detail: 'Tạo standard, campaign và loyalty policy theo cùng behavioral rule. Không để mỗi strategy fetch dữ liệu tùy ý; chuẩn bị context trước selection.' },
      },
      {
        en: { name: 'Centralize selection', detail: 'Select policy from explicit campaign and customer facts. Log a safe strategy identifier and reject ambiguous combinations rather than relying on registration order.' },
        vn: { name: 'Tập trung selection', detail: 'Chọn policy từ campaign và customer fact tường minh. Log strategy identifier an toàn và từ chối tổ hợp mơ hồ thay vì dựa registration order.' },
      },
      {
        en: { name: 'Publish a completed fact', detail: 'After persisting the quote, publish OrderPriced with a stable identifier and necessary immutable data. Avoid exposing the strategy object or mutable order aggregate.' },
        vn: { name: 'Publish fact đã hoàn tất', detail: 'Sau khi persist quote, publish OrderPriced với stable identifier và immutable data cần thiết. Tránh expose strategy object hoặc mutable order aggregate.' },
      },
      {
        en: { name: 'Choose observer semantics', detail: 'For in-process listeners, decide whether failures stop the request or are isolated. For durable consumers, define at-least-once delivery, idempotency, ordering, retry, and dead-letter handling.' },
        vn: { name: 'Chọn observer semantics', detail: 'Với in-process listener, quyết định failure có dừng request hay được isolate. Với durable consumer, định nghĩa at-least-once delivery, idempotency, ordering, retry và dead-letter handling.' },
      },
    ],
    language: 'ts',
    code: `type PriceStrategy = (subtotal: number) => { total: number; reason: string };
type Listener<T> = (event: T) => Promise<void>;

async function priceOrder(subtotal: number, strategy: PriceStrategy, listeners: Listener<{ total: number }>[]) {
  const quote = strategy(subtotal);
  await Promise.allSettled(listeners.map((notify) => notify({ total: quote.total })));
  return quote;
}`,
    change: {
      en: 'the company adds region-specific pricing and moves loyalty processing to a durable queue without changing core quote calculation',
      vn: 'công ty thêm pricing theo region và chuyển loyalty processing sang durable queue mà không đổi core quote calculation',
    },
    pitfalls: [
      {
        en: { name: 'Strategy per tiny branch', detail: 'Turning every conditional into an object scatters a cohesive policy. A lookup table or function may express simple variation better.' },
        vn: { name: 'Strategy cho từng nhánh nhỏ', detail: 'Biến mọi conditional thành object làm phân tán policy cohesive. Lookup table hoặc function có thể diễn đạt variation đơn giản tốt hơn.' },
      },
      {
        en: { name: 'Invisible selection', detail: 'Plugin scanning or registration order can make the active strategy impossible to predict. Keep precedence deterministic and observable.' },
        vn: { name: 'Selection vô hình', detail: 'Plugin scanning hoặc registration order có thể làm active strategy không đoán được. Giữ precedence xác định và observable.' },
      },
      {
        en: { name: 'Observer as hidden critical path', detail: 'If loosely named listeners must all succeed for the transaction, they are not optional reactions. Model required workflow steps explicitly.' },
        vn: { name: 'Observer thành critical path ẩn', detail: 'Nếu listener mang tên loose coupling nhưng tất cả phải thành công cho transaction, chúng không phải reaction tùy chọn. Hãy model required workflow step tường minh.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Shipping strategies', detail: 'Implement standard, express, and pickup policies with one quote contract. Centralize selection and test ambiguous or unsupported addresses.' },
        vn: { name: 'Shipping strategy', detail: 'Implement standard, express và pickup policy với một quote contract. Tập trung selection và test address mơ hồ hoặc không hỗ trợ.' },
      },
      {
        en: { name: 'Observer delivery matrix', detail: 'Model audit, email, and inventory listeners. Classify each as critical, best-effort, or durable, then implement and test matching failure semantics.' },
        vn: { name: 'Ma trận delivery cho observer', detail: 'Model audit, email và inventory listener. Phân loại critical, best-effort hoặc durable rồi implement và test failure semantics tương ứng.' },
      },
      {
        en: { name: 'Event contract evolution', detail: 'Design versioned OrderPriced events and an idempotent loyalty consumer. Simulate duplicate, delayed, and out-of-order delivery.' },
        vn: { name: 'Tiến hóa event contract', detail: 'Thiết kế OrderPriced event có version và loyalty consumer idempotent. Mô phỏng duplicate, delayed và out-of-order delivery.' },
      },
    ],
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
    why: {
      en: 'Command turns a request into a value that can be queued, retried, authorized, logged, or undone. Template Method fixes an algorithm skeleton while subclasses customize steps. In JavaScript, a higher-order workflow often expresses the same intent with less inheritance risk, so this lesson teaches the pressure rather than insisting on class form.',
      vn: 'Command biến request thành value có thể queue, retry, authorize, log hoặc undo. Template Method cố định algorithm skeleton trong khi subclass customize từng bước. Trong JavaScript, higher-order workflow thường diễn đạt cùng intent với ít rủi ro inheritance hơn, nên bài này dạy áp lực thay vì ép class form.',
    },
    context: {
      en: 'a data-import platform that accepts import requests, queues execution, and runs a validate-transform-persist-notify workflow for several formats',
      vn: 'data-import platform nhận import request, queue execution và chạy workflow validate-transform-persist-notify cho nhiều format',
    },
    pressure: {
      en: 'requests need identity and durable execution, while the workflow order must stay consistent across format-specific steps',
      vn: 'request cần identity và durable execution, còn workflow order phải nhất quán qua step riêng từng format',
    },
    evidence: {
      en: 'Controllers currently execute imports directly, and CSV versus JSON implementations have drifted in authorization, transaction handling, and notification order.',
      vn: 'Controller hiện execute import trực tiếp, còn implementation CSV và JSON đã lệch authorization, transaction handling và notification order.',
    },
    decision: {
      en: 'Use Command when an action needs identity or lifecycle beyond a call; use Template Method or a composed template when workflow order is invariant and selected steps vary.',
      vn: 'Dùng Command khi action cần identity hoặc lifecycle vượt một call; dùng Template Method hay composed template khi workflow order bất biến và một số step biến đổi.',
    },
    concepts: [
      {
        en: { name: 'Command separates request from execution', detail: 'A command contains validated intent and identity; a handler performs work. This allows transport, scheduling, authorization, deduplication, and retry to surround execution without putting them in the domain method.' },
        vn: { name: 'Command tách request khỏi execution', detail: 'Command chứa intent đã validate và identity; handler thực hiện work. Cách này cho transport, scheduling, authorization, deduplication và retry bao quanh execution mà không chui vào domain method.' },
      },
      {
        en: { name: 'Template owns invariant order', detail: 'The template makes required sequence and shared cleanup visible. Variable steps must have narrow contracts so they cannot skip authorization or commit before validation.' },
        vn: { name: 'Template sở hữu thứ tự bất biến', detail: 'Template làm required sequence và shared cleanup nhìn thấy rõ. Variable step cần contract hẹp để không thể bỏ authorization hoặc commit trước validation.' },
      },
      {
        en: { name: 'Composition avoids fragile base classes', detail: 'Passing parse and transform functions to a workflow preserves the skeleton without protected hooks, implicit state, or subclass call-order assumptions. A class template remains useful when lifecycle and shared state are genuine.' },
        vn: { name: 'Composition tránh fragile base class', detail: 'Truyền parse và transform function vào workflow giữ skeleton mà không cần protected hook, implicit state hoặc assumption về call order của subclass. Class template vẫn hữu ích khi lifecycle và shared state là thật.' },
      },
    ],
    steps: [
      {
        en: { name: 'Define immutable command data', detail: 'Create StartImport with command ID, actor, source reference, format, and requested options. Validate syntax at ingress but leave domain validation to execution.' },
        vn: { name: 'Định nghĩa command data immutable', detail: 'Tạo StartImport gồm command ID, actor, source reference, format và option yêu cầu. Validate syntax ở ingress nhưng để domain validation cho execution.' },
      },
      {
        en: { name: 'Make the handler idempotent', detail: 'Record command identity and outcome so retries do not duplicate persisted rows or notifications. Define how concurrent deliveries of the same command coordinate.' },
        vn: { name: 'Làm handler idempotent', detail: 'Ghi command identity và outcome để retry không duplicate persisted row hoặc notification. Định nghĩa cách concurrent delivery của cùng command phối hợp.' },
      },
      {
        en: { name: 'Write the workflow skeleton', detail: 'Keep authorize, load, parse, validate, transform, persist, and publish order in one function. Place transaction boundaries and cleanup where every format follows them.' },
        vn: { name: 'Viết workflow skeleton', detail: 'Giữ thứ tự authorize, load, parse, validate, transform, persist và publish trong một function. Đặt transaction boundary và cleanup nơi mọi format đều tuân theo.' },
      },
      {
        en: { name: 'Inject variable steps', detail: 'Provide parser and transformer capabilities selected by format. Keep them deterministic where possible and prevent them from committing, publishing, or mutating workflow state.' },
        vn: { name: 'Inject step biến đổi', detail: 'Cung cấp parser và transformer capability được chọn theo format. Giữ chúng deterministic khi có thể và không cho commit, publish hoặc mutate workflow state.' },
      },
      {
        en: { name: 'Expose status and failures', detail: 'Return an operation identifier immediately, persist progress, classify terminal versus retryable errors, and make partial import policy explicit. Commands need operational visibility.' },
        vn: { name: 'Expose status và failure', detail: 'Trả operation identifier ngay, persist progress, phân loại terminal với retryable error và làm rõ partial import policy. Command cần operational visibility.' },
      },
    ],
    language: 'ts',
    code: `type Steps<T> = {
  parse(raw: string): T[];
  validate(rows: T[]): void;
  persist(rows: T[]): Promise<void>;
};

async function runImport<T>(raw: string, steps: Steps<T>) {
  const rows = steps.parse(raw);
  steps.validate(rows);
  await steps.persist(rows);
  return { imported: rows.length };
}`,
    change: {
      en: 'imports move to an at-least-once queue and a new XML format must obey exactly the same authorization, transaction, and notification sequence',
      vn: 'import chuyển sang at-least-once queue và format XML mới phải tuân đúng chuỗi authorization, transaction và notification',
    },
    pitfalls: [
      {
        en: { name: 'Anemic command bus everywhere', detail: 'Wrapping every local function call in command objects and a bus adds dispatch indirection without lifecycle benefits. Use commands where request identity matters.' },
        vn: { name: 'Command bus rỗng ở mọi nơi', detail: 'Wrap mọi local function call bằng command object và bus tăng dispatch indirection mà không có lifecycle benefit. Dùng command nơi request identity quan trọng.' },
      },
      {
        en: { name: 'Undo as a promise', detail: 'Real side effects such as email or external payment cannot always be reversed. Model compensation with explicit limitations rather than a generic undo method.' },
        vn: { name: 'Hứa hẹn undo', detail: 'Side effect thật như email hoặc external payment không phải lúc nào cũng đảo ngược. Model compensation với giới hạn tường minh thay vì generic undo method.' },
      },
      {
        en: { name: 'Hook-heavy base classes', detail: 'Numerous optional hooks create hidden call-order contracts and subclass coupling. Prefer a small required step object or explicit pipeline.' },
        vn: { name: 'Base class quá nhiều hook', detail: 'Nhiều optional hook tạo hidden call-order contract và subclass coupling. Ưu tiên required step object nhỏ hoặc pipeline tường minh.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Idempotent command handler', detail: 'Implement GenerateInvoice as a queued command. Handle duplicate delivery, retryable storage failure, permanent validation failure, and observable status.' },
        vn: { name: 'Command handler idempotent', detail: 'Implement GenerateInvoice như queued command. Xử lý duplicate delivery, retryable storage failure, permanent validation failure và status observable.' },
      },
      {
        en: { name: 'Composed template', detail: 'Build an image-processing workflow with decode, validate, resize, store, and publish steps. Allow JPEG and PNG variation without inheritance.' },
        vn: { name: 'Template bằng composition', detail: 'Dựng image-processing workflow gồm decode, validate, resize, store và publish. Cho phép JPEG và PNG variation mà không inheritance.' },
      },
      {
        en: { name: 'Inheritance comparison', detail: 'Implement the same workflow with Template Method subclasses and with injected functions. Compare state ownership, test setup, extension safety, and stack traces.' },
        vn: { name: 'So sánh inheritance', detail: 'Implement cùng workflow bằng Template Method subclass và injected function. So sánh state ownership, test setup, extension safety và stack trace.' },
      },
    ],
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
    why: {
      en: 'Real features rarely fit one pattern, but adding many named structures can erase the feature beneath architecture. The goal is a coherent responsibility map where each pattern solves one evidenced pressure and the unpatterned domain flow remains readable. This lesson builds that map incrementally.',
      vn: 'Tính năng thật hiếm khi vừa một pattern, nhưng thêm nhiều cấu trúc có tên có thể làm tính năng biến mất dưới architecture. Mục tiêu là responsibility map mạch lạc, mỗi pattern giải một áp lực có bằng chứng và domain flow không pattern vẫn dễ đọc. Bài này dựng bản đồ đó từng bước.',
    },
    context: {
      en: 'a subscription-renewal feature that chooses pricing, charges a payment provider, persists state, and notifies downstream systems',
      vn: 'tính năng subscription renewal chọn pricing, charge payment provider, persist state và thông báo downstream system',
    },
    pressure: {
      en: 'policy, vendor compatibility, orchestration, and post-renewal reactions change independently but must preserve one reliable business outcome',
      vn: 'policy, vendor compatibility, orchestration và phản ứng sau renewal thay đổi độc lập nhưng phải giữ một business outcome đáng tin',
    },
    evidence: {
      en: 'Renewal incidents span mixed concerns: a provider timeout duplicates charges, a pricing change edits orchestration, and analytics failure blocks successful renewal.',
      vn: 'Incident renewal trải qua concern trộn lẫn: provider timeout tạo duplicate charge, pricing change sửa orchestration và analytics failure chặn renewal thành công.',
    },
    decision: {
      en: 'Combine patterns only when each has a distinct force, owner, and contract; compose them around a plain use-case workflow.',
      vn: 'Chỉ kết hợp pattern khi mỗi pattern có force, owner và contract riêng; compose chúng quanh use-case workflow thuần.',
    },
    concepts: [
      {
        en: { name: 'The workflow is the spine', detail: 'Renewal order—load, check eligibility, quote, charge, persist, publish—should remain visible. Patterns plug into decisions and edges; they do not replace the narrative.' },
        vn: { name: 'Workflow là xương sống', detail: 'Thứ tự renewal—load, check eligibility, quote, charge, persist, publish—phải nhìn thấy rõ. Pattern cắm vào decision và edge; chúng không thay thế câu chuyện.' },
      },
      {
        en: { name: 'One pattern, one pressure', detail: 'Strategy owns price policy, Adapter owns provider translation, Command owns durable request identity, and Observer owns secondary fan-out. Clear intent prevents overlapping abstractions.' },
        vn: { name: 'Một pattern, một áp lực', detail: 'Strategy sở hữu price policy, Adapter sở hữu provider translation, Command sở hữu durable request identity và Observer sở hữu secondary fan-out. Intent rõ tránh abstraction chồng lấn.' },
      },
      {
        en: { name: 'Composition root reveals the graph', detail: 'Startup selects concrete pricing, payment adapter, repository, and event publisher. The use case receives capabilities and does not know registries or containers.' },
        vn: { name: 'Composition root để lộ graph', detail: 'Startup chọn pricing cụ thể, payment adapter, repository và event publisher. Use case nhận capability và không biết registry hoặc container.' },
      },
    ],
    steps: [
      {
        en: { name: 'Write a direct renewal', detail: 'Implement one provider and one pricing rule in a straightforward function. Define idempotency key, state transition, and success before extracting any pattern.' },
        vn: { name: 'Viết renewal trực tiếp', detail: 'Implement một provider và một pricing rule bằng function thẳng. Định nghĩa idempotency key, state transition và success trước khi tách pattern.' },
      },
      {
        en: { name: 'Extract policy as Strategy', detail: 'Move quote calculation behind a pure pricing capability because plan and region rules change independently. Keep eligibility and renewal ordering in the use case.' },
        vn: { name: 'Tách policy thành Strategy', detail: 'Đưa quote calculation sau pricing capability pure vì plan và region rule thay đổi độc lập. Giữ eligibility và renewal ordering trong use case.' },
      },
      {
        en: { name: 'Adapt the payment boundary', detail: 'Translate domain cents, renewal ID, idempotency, approval, decline, and timeout to provider semantics. Do not let SDK response objects cross inward.' },
        vn: { name: 'Adapt payment boundary', detail: 'Dịch domain cents, renewal ID, idempotency, approval, decline và timeout sang provider semantics. Không để SDK response object đi vào trong.' },
      },
      {
        en: { name: 'Wrap execution in a Command', detail: 'Give renewal durable identity and deduplication when scheduling and retry become requirements. The command handler invokes the same readable use case.' },
        vn: { name: 'Wrap execution bằng Command', detail: 'Cấp durable identity và deduplication cho renewal khi scheduling và retry trở thành requirement. Command handler gọi cùng use case dễ đọc.' },
      },
      {
        en: { name: 'Publish post-commit facts', detail: 'After renewal state commits, publish SubscriptionRenewed for analytics and email. Use an outbox or equivalent atomic handoff when loss between database and broker is unacceptable.' },
        vn: { name: 'Publish fact sau commit', detail: 'Sau khi renewal state commit, publish SubscriptionRenewed cho analytics và email. Dùng outbox hoặc atomic handoff tương đương khi không chấp nhận mất message giữa database và broker.' },
      },
    ],
    language: 'ts',
    code: `async function renew(id: string, deps: Deps) {
  const sub = await deps.subscriptions.get(id);
  const quote = deps.pricing.quote(sub);
  const paymentId = await deps.payments.charge({
    cents: quote.total, idempotencyKey: \`renew:\${id}:\${sub.period}\`,
  });
  const renewed = sub.renew(paymentId);
  await deps.unitOfWork.saveAndPublish(renewed, { type: 'SubscriptionRenewed', id });
  return renewed;
}`,
    change: {
      en: 'a second payment provider, annual-plan pricing, queued retries, and two new event consumers arrive in separate releases',
      vn: 'payment provider thứ hai, annual-plan pricing, queued retry và hai event consumer mới xuất hiện ở các release riêng',
    },
    pitfalls: [
      {
        en: { name: 'Pattern stack as architecture', detail: 'A chain of Factory-Strategy-Command-Observer names does not explain the business. Keep the renewal narrative primary and annotate patterns second.' },
        vn: { name: 'Pattern stack thành architecture', detail: 'Chuỗi tên Factory-Strategy-Command-Observer không giải thích business. Giữ câu chuyện renewal là chính và annotation pattern là phụ.' },
      },
      {
        en: { name: 'Overlapping ownership', detail: 'If Strategy, facade, and command handler all validate eligibility or translate errors, changes scatter. Assign one invariant owner and delegate.' },
        vn: { name: 'Ownership chồng lấn', detail: 'Nếu Strategy, facade và command handler đều validate eligibility hoặc translate error, thay đổi sẽ phân tán. Gán một invariant owner rồi delegate.' },
      },
      {
        en: { name: 'Ignoring consistency gaps', detail: 'Patterns do not make database writes and messages atomic. Model idempotency, transaction boundaries, outbox delivery, and reconciliation explicitly.' },
        vn: { name: 'Bỏ qua consistency gap', detail: 'Pattern không làm database write và message atomic. Hãy model idempotency, transaction boundary, outbox delivery và reconciliation tường minh.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Build renewal incrementally', detail: 'Start with direct code, then add Strategy, Adapter, Command, and Observer one at a time. After each step, record the pressure solved and concepts added.' },
        vn: { name: 'Dựng renewal từng bước', detail: 'Bắt đầu bằng direct code rồi thêm Strategy, Adapter, Command và Observer từng cái. Sau mỗi bước, ghi pressure đã giải và concept đã thêm.' },
      },
      {
        en: { name: 'Failure table', detail: 'Create a table for decline, timeout, duplicate command, database conflict, broker outage, and consumer failure. Assign owner, retry, compensation, and observability.' },
        vn: { name: 'Bảng failure', detail: 'Tạo bảng cho decline, timeout, duplicate command, database conflict, broker outage và consumer failure. Gán owner, retry, compensation và observability.' },
      },
      {
        en: { name: 'Remove one pattern', detail: 'Choose the least evidenced pattern in the solution and collapse it. Compare changed files, tests, and clarity; keep it removed unless a concrete scenario becomes worse.' },
        vn: { name: 'Xóa một pattern', detail: 'Chọn pattern ít bằng chứng nhất trong solution và collapse nó. So sánh changed file, test và clarity; giữ nó bị xóa trừ khi scenario cụ thể tệ hơn.' },
      },
    ],
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
    why: {
      en: 'The capstone is not a memory test for pattern names. It is a repeatable review that begins with behavior, follows dependencies and state, validates each abstraction against evidence, and ends with an operable, reversible feature. The checklist helps mid-level engineers lead that review without turning it into ceremony.',
      vn: 'Capstone không phải bài kiểm tra nhớ tên pattern. Đây là review lặp lại được, bắt đầu từ behavior, theo dependency và state, xác minh mỗi abstraction bằng evidence và kết thúc bằng feature vận hành được, có thể đảo ngược. Checklist giúp kỹ sư tầm trung dẫn dắt review mà không biến nó thành nghi thức.',
    },
    context: {
      en: 'a team reviewing a production-ready document-approval workflow with policy selection, storage integration, commands, and notifications',
      vn: 'team review workflow duyệt tài liệu sẵn sàng production với policy selection, storage integration, command và notification',
    },
    pressure: {
      en: 'the design must support known variation and failure without becoming a showcase of speculative abstraction',
      vn: 'thiết kế phải hỗ trợ variation và failure đã biết mà không thành màn trình diễn abstraction giả định',
    },
    evidence: {
      en: 'The checklist uses change scenarios, failure injection, contract tests, and deletion analysis rather than counting interfaces or recognizing diagrams.',
      vn: 'Checklist dùng change scenario, failure injection, contract test và deletion analysis thay vì đếm interface hoặc nhận diện diagram.',
    },
    decision: {
      en: 'Approve a pattern only when its force, boundary, owner, contract, test evidence, operational behavior, and removal path are all understandable.',
      vn: 'Chỉ approve pattern khi force, boundary, owner, contract, test evidence, operational behavior và removal path đều hiểu được.',
    },
    concepts: [
      {
        en: { name: 'Behavior and invariants first', detail: 'Review starts with user-visible outcomes, authorization, ordering, money or data integrity, and failure promises. Structure is evaluated by how well it protects these facts.' },
        vn: { name: 'Behavior và invariant trước', detail: 'Review bắt đầu bằng outcome user thấy, authorization, ordering, money hoặc data integrity và failure promise. Cấu trúc được đánh giá qua khả năng bảo vệ các fact này.' },
      },
      {
        en: { name: 'Evidence for every seam', detail: 'Each interface, callback list, factory, wrapper, or base class should point to an observed change, external boundary, ownership split, or testing need that cannot be met more directly.' },
        vn: { name: 'Evidence cho mọi seam', detail: 'Mỗi interface, callback list, factory, wrapper hoặc base class phải trỏ đến observed change, external boundary, ownership split hoặc testing need không thể đáp ứng trực tiếp hơn.' },
      },
      {
        en: { name: 'Operations and deletion complete the design', detail: 'Logs, metrics, retries, idempotency, shutdown, and diagnostics show whether a pattern survives production. A removal plan tests whether domain behavior is independent from the abstraction.' },
        vn: { name: 'Operations và deletion hoàn tất thiết kế', detail: 'Log, metrics, retry, idempotency, shutdown và diagnostic cho thấy pattern có sống được trong production không. Removal plan kiểm tra domain behavior có độc lập abstraction không.' },
      },
    ],
    steps: [
      {
        en: { name: 'Frame the feature', detail: 'Write actors, trigger, happy path, outputs, invariants, and top failures on one page. Mark system boundaries and data classifications before discussing patterns.' },
        vn: { name: 'Đóng khung feature', detail: 'Viết actor, trigger, happy path, output, invariant và failure chính trên một trang. Đánh dấu system boundary và data classification trước khi bàn pattern.' },
      },
      {
        en: { name: 'Trace ownership and lifetime', detail: 'For every stateful participant, identify creator, owner, scope, mutation rules, concurrency, and disposal. Reject ambiguous global state.' },
        vn: { name: 'Trace ownership và lifetime', detail: 'Với mỗi stateful participant, xác định creator, owner, scope, mutation rule, concurrency và disposal. Từ chối global state mơ hồ.' },
      },
      {
        en: { name: 'Challenge each pattern', detail: 'State context, force, stable contract, participants, consequences, simpler alternative, and removal condition. Delete any participant without a unique responsibility.' },
        vn: { name: 'Thách thức từng pattern', detail: 'Nêu context, force, stable contract, participant, consequence, simpler alternative và removal condition. Xóa participant không có trách nhiệm riêng.' },
      },
      {
        en: { name: 'Simulate change and failure', detail: 'Walk through one likely business change, one vendor replacement, one timeout, one duplicate, and one partial failure. Count affected contracts and verify recovery ownership.' },
        vn: { name: 'Mô phỏng change và failure', detail: 'Đi qua một business change có khả năng, một vendor replacement, một timeout, một duplicate và một partial failure. Đếm contract bị ảnh hưởng và xác minh recovery ownership.' },
      },
      {
        en: { name: 'Verify and record the decision', detail: 'Run focused unit, contract, integration, and end-to-end tests. Record a short decision note with evidence, trade-offs, observability, and a date or signal for reevaluation.' },
        vn: { name: 'Xác minh và ghi decision', detail: 'Chạy unit, contract, integration và end-to-end test có trọng tâm. Ghi decision note ngắn gồm evidence, trade-off, observability và ngày hoặc tín hiệu reevaluate.' },
      },
    ],
    language: 'text',
    code: `Pattern review card
- Force:
- Stable contract:
- Owner and lifetime:
- Simpler alternative:
- Failure semantics:
- Executable evidence:
- Trade-off accepted:
- Removal condition:`,
    change: {
      en: 'legal adds a second approval policy, storage vendor migration begins, and notifications move from in-process listeners to durable delivery',
      vn: 'legal thêm approval policy thứ hai, migration storage vendor bắt đầu và notification chuyển từ in-process listener sang durable delivery',
    },
    pitfalls: [
      {
        en: { name: 'Checklist theater', detail: 'Boxes checked without traces, tests, or decisions create confidence without evidence. Require a concrete artifact for every high-risk answer.' },
        vn: { name: 'Checklist hình thức', detail: 'Tick box mà không trace, test hoặc decision tạo tự tin thiếu evidence. Yêu cầu artifact cụ thể cho mọi câu trả lời rủi ro cao.' },
      },
      {
        en: { name: 'Pattern-name scoring', detail: 'More patterns do not mean a more advanced design. Score clarity of responsibility, change isolation, failure handling, and reversibility.' },
        vn: { name: 'Chấm điểm theo tên pattern', detail: 'Nhiều pattern không đồng nghĩa thiết kế advanced hơn. Chấm clarity của responsibility, change isolation, failure handling và reversibility.' },
      },
      {
        en: { name: 'Ignoring production topology', detail: 'A design that works in one process may fail across workers, retries, deploys, and network partitions. Review actual runtime boundaries and delivery guarantees.' },
        vn: { name: 'Bỏ qua production topology', detail: 'Thiết kế chạy trong một process có thể lỗi qua worker, retry, deploy và network partition. Review runtime boundary thật và delivery guarantee.' },
      },
    ],
    exercises: [
      {
        en: { name: 'Full feature review', detail: 'Apply the capstone card to document approval. Produce a responsibility diagram, change simulation, failure table, contract tests, and one-page decision note.' },
        vn: { name: 'Review feature đầy đủ', detail: 'Áp dụng capstone card cho document approval. Tạo responsibility diagram, change simulation, failure table, contract test và decision note một trang.' },
      },
      {
        en: { name: 'Red-team the abstractions', detail: 'Exchange designs with a peer. Argue for deleting every pattern, then keep only those whose removal demonstrably worsens a named scenario.' },
        vn: { name: 'Red-team abstraction', detail: 'Trao đổi design với đồng đội. Lập luận xóa mọi pattern rồi chỉ giữ pattern mà việc xóa làm scenario có tên tệ đi rõ ràng.' },
      },
      {
        en: { name: 'Production readiness drill', detail: 'Inject timeout, duplicate message, stale cache, shutdown during work, and malformed vendor response. Verify ownership, diagnostics, recovery, and user-visible outcome.' },
        vn: { name: 'Drill production readiness', detail: 'Inject timeout, duplicate message, stale cache, shutdown giữa work và malformed vendor response. Xác minh ownership, diagnostics, recovery và outcome user thấy.' },
      },
      {
        en: { name: 'Six-month simplification', detail: 'Assume half the predicted variations never arrived. Propose a smaller design, identify safe deletions, and preserve behavior with existing tests.' },
        vn: { name: 'Đơn giản hóa sau sáu tháng', detail: 'Giả sử một nửa variation dự đoán không xuất hiện. Đề xuất thiết kế nhỏ hơn, xác định safe deletion và giữ behavior bằng test hiện có.' },
      },
    ],
  },
];

/** @type {import('../catalog.js').Course} */
export const designPatterns = {
  id: 'design-patterns',
  title: { en: 'Design Patterns', vn: 'Mẫu thiết kế' },
  summary: {
    en: 'Evidence-driven design patterns: vocabulary, creation, structure, behavior, composition, and a production-minded capstone.',
    vn: 'Design pattern dựa trên bằng chứng: vocabulary, creation, structure, behavior, composition và capstone hướng production.',
  },
  sections: lessonSpecs.map((spec) => ({
    id: spec.id,
    title: spec.title,
    baseline: spec.baseline,
    skills: spec.skills,
    diagram: spec.id,
    body: {
      en: renderEnglish(spec),
      vn: renderVietnamese(spec),
    },
  })),
};
