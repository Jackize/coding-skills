const shared = {
  en: {
    why: `Treat this topic as an engineering boundary, not a collection of Docker commands. A useful boundary states what is controlled by the image, what is supplied by the runtime, and what remains the operator's responsibility. That separation makes incidents easier to diagnose because a team can ask whether a failure was baked into an artifact, introduced by configuration, or caused by the host. It also makes reviews concrete: another engineer can reproduce the build, inspect the resulting image, and run the same checks without inheriting hidden workstation state.

The practical standard is repeatability rather than “it works on my machine.” Repeatability means that source, declared inputs, and a documented command produce the same kind of artifact; a fresh runtime can start it; and observable checks distinguish startup from readiness. Docker does not guarantee deterministic applications by itself. Package ranges, mutable base tags, network downloads, timestamps, architecture, and external services can still vary. The point is to identify those variables and choose which ones to pin, expose, or test.`,
    model: `Keep three timelines separate. Build time turns a context and Dockerfile into an immutable image. Create time combines that image with runtime configuration to produce a container definition. Run time starts the container's configured process inside isolated namespaces with resource accounting. Rebuilding changes an image; restarting preserves the same container definition; recreating applies changed configuration. Confusing those verbs is the source of many “why did my change not apply?” debugging sessions.

Use the image/container distinction in everyday language. An image is content-addressed, shareable input. A container is one execution of that input plus a writable layer and runtime settings. Logs, metrics, volumes, networks, and published ports are attachments around that execution. They are not magically part of the image. When a container disappears, only data deliberately placed outside its writable layer should be expected to remain.

For diagnosis, move from outside to inside. First inspect the declared state with \`docker compose config\` or \`docker inspect\`. Then inspect lifecycle state with \`docker ps -a\` and health status. Next read logs and events. Finally use \`docker exec\` only when the container is running and an interactive look is genuinely useful. This order preserves evidence and avoids changing the system before understanding it.`,
    walkthrough: `Run the walkthrough from a clean directory and keep the Dockerfile, Compose file, source, and ignore file under version control. Start with \`docker compose config\`; it catches interpolation and merge mistakes before anything runs. Build with plain progress when investigating cache behavior: \`docker compose build --progress=plain\`. Start in detached mode, inspect with \`docker compose ps\`, and read bounded logs with \`docker compose logs --tail=100\`. A successful build is only the first checkpoint; prove the process starts, prove the expected endpoint or command works, and prove teardown behaves as intended.

After each meaningful edit, predict which layer or runtime object should change before running the command. If the observation differs from the prediction, stop and explain the discrepancy. That habit turns Docker from trial-and-error syntax into a model you can transfer to CI and production. Record the exact validation command beside the change so a reviewer does not have to infer what “tested” means.`,
    pitfalls: `Docker exposes trade-offs rather than removing them. Smaller images reduce transfer and attack surface, but extremely minimal images can make certificate, timezone, native-library, and incident debugging problems less obvious. Aggressive caching speeds builds, but a poorly ordered Dockerfile can preserve stale inputs or invalidate expensive layers. Automatic restarts improve recovery from transient faults, but they can hide deterministic crashes in a noisy loop. Convenience mounts shorten local feedback cycles, but they can mask files that are actually missing from the image.

Prefer a boring default and make exceptions measurable. Keep the runtime image focused, run one service concern per container, emit logs to standard output, and make state explicit. Do not copy a production orchestrator's every feature into local Compose, and do not assume a Compose file is a production deployment specification. The useful overlap is the contract: image, command, ports, configuration names, dependencies, health signal, and persistent data.`,
    practice: `For every exercise, save the command, the observation, and one sentence explaining why the observation follows from the model. “Container is up” is not enough evidence. Include an application-level check, inspect the relevant Docker object, and tear the stack down when finished. Re-run once from a clean state when the exercise concerns builds or persistence. That second run catches accidental dependence on a warm cache, an old container, or data left on the workstation.

Review your result as if it were a teammate's pull request. Can a new engineer find the entry point? Are versions and assumptions visible? Is sensitive data absent from the image and repository? Is failure observable without opening an interactive shell? Is cleanup safe? A concise README command or Make target can help, but only add one after the raw Docker commands are understood.`,
    labels: {
      decision: 'Decision lens',
      invariants: 'Invariants to keep',
      files: 'Working example',
      steps: 'Run and inspect',
      review: 'Operational review',
      traps: 'Common failure modes',
      tradeoff: 'Trade-off to discuss',
      exercises: 'Exercises',
      done: 'Evidence of completion',
    },
  },
  vn: {
    why: `Hãy xem chủ đề này như một ranh giới kỹ thuật, không phải một tập hợp lệnh Docker. Một ranh giới hữu ích chỉ rõ phần nào do image kiểm soát, phần nào do runtime cung cấp và phần nào vẫn là trách nhiệm của người vận hành. Sự tách biệt đó giúp chẩn đoán sự cố dễ hơn vì đội ngũ có thể hỏi lỗi đã được đóng gói vào artifact, được đưa vào qua cấu hình hay đến từ host. Nó cũng làm cho review cụ thể: một kỹ sư khác có thể tái tạo build, kiểm tra image tạo ra và chạy cùng các phép kiểm tra mà không kế thừa trạng thái ẩn trên máy cá nhân.

Tiêu chuẩn thực tế là khả năng lặp lại, không phải “chạy được trên máy tôi”. Khả năng lặp lại nghĩa là mã nguồn, input đã khai báo và một lệnh được ghi lại tạo ra cùng một loại artifact; một runtime mới có thể khởi động nó; và các phép kiểm tra quan sát được phân biệt được startup với readiness. Docker tự nó không đảm bảo ứng dụng hoàn toàn tất định. Khoảng phiên bản package, base tag có thể thay đổi, tải qua mạng, timestamp, kiến trúc CPU và dịch vụ bên ngoài vẫn có thể khác. Mục tiêu là nhận diện các biến đó rồi quyết định biến nào cần pin, công khai hoặc kiểm thử.`,
    model: `Luôn tách ba thời điểm. Build time biến build context và Dockerfile thành image bất biến. Create time kết hợp image với cấu hình runtime để tạo định nghĩa container. Run time khởi động process đã cấu hình trong namespace cô lập và có thống kê tài nguyên. Rebuild làm thay đổi image; restart giữ nguyên định nghĩa container; recreate áp dụng cấu hình đã đổi. Nhầm các động từ này là nguyên nhân của nhiều phiên debug “tại sao thay đổi của tôi chưa được áp dụng?”.

Hãy dùng đúng phân biệt image/container trong giao tiếp hằng ngày. Image là input có địa chỉ theo nội dung và có thể chia sẻ. Container là một lần thực thi input đó, cộng writable layer và thiết lập runtime. Log, metric, volume, network và published port là các phần gắn quanh lần thực thi. Chúng không tự động trở thành một phần của image. Khi container biến mất, chỉ dữ liệu được chủ động đặt ngoài writable layer mới được kỳ vọng là còn lại.

Khi chẩn đoán, đi từ ngoài vào trong. Đầu tiên kiểm tra trạng thái khai báo bằng \`docker compose config\` hoặc \`docker inspect\`. Sau đó xem vòng đời bằng \`docker ps -a\` và health status. Tiếp theo đọc log và event. Cuối cùng chỉ dùng \`docker exec\` khi container đang chạy và việc quan sát tương tác thật sự cần thiết. Thứ tự này giữ lại bằng chứng và tránh thay đổi hệ thống trước khi hiểu nó.`,
    walkthrough: `Chạy walkthrough trong một thư mục sạch và quản lý Dockerfile, Compose file, mã nguồn cùng ignore file bằng version control. Bắt đầu với \`docker compose config\`; lệnh này phát hiện lỗi nội suy và merge trước khi chạy gì. Khi điều tra cache, build với tiến trình rõ ràng: \`docker compose build --progress=plain\`. Khởi động detached, kiểm tra bằng \`docker compose ps\`, rồi đọc log có giới hạn bằng \`docker compose logs --tail=100\`. Build thành công mới chỉ là checkpoint đầu tiên; cần chứng minh process khởi động, endpoint hoặc lệnh mong đợi hoạt động và teardown có hành vi đúng.

Sau mỗi thay đổi có ý nghĩa, hãy dự đoán layer hoặc runtime object nào sẽ đổi trước khi chạy lệnh. Nếu quan sát khác dự đoán, dừng lại và giải thích sự khác biệt. Thói quen đó biến Docker từ cú pháp thử-sai thành một mô hình có thể chuyển sang CI và production. Ghi lệnh xác minh chính xác cạnh thay đổi để reviewer không phải đoán “đã test” nghĩa là gì.`,
    pitfalls: `Docker làm lộ ra trade-off chứ không xóa chúng. Image nhỏ giảm thời gian truyền và bề mặt tấn công, nhưng image quá tối giản có thể làm vấn đề certificate, timezone, native library và debug sự cố khó thấy hơn. Cache mạnh làm build nhanh, nhưng Dockerfile sắp xếp kém có thể giữ input cũ hoặc làm mất cache của layer tốn kém. Tự động restart giúp phục hồi lỗi tạm thời, nhưng có thể che một crash tất định trong vòng lặp ồn ào. Mount tiện dụng rút ngắn vòng phản hồi local, nhưng có thể che việc file thực tế bị thiếu trong image.

Ưu tiên mặc định đơn giản và làm cho ngoại lệ đo được. Giữ runtime image tập trung, chạy một mối quan tâm dịch vụ trên mỗi container, xuất log ra standard output và khai báo state rõ ràng. Không sao chép mọi tính năng của orchestrator production vào Compose local, và không giả định Compose file là đặc tả triển khai production. Phần giao nhau hữu ích là contract: image, command, port, tên cấu hình, dependency, health signal và dữ liệu bền vững.`,
    practice: `Với mỗi bài tập, lưu lệnh, quan sát và một câu giải thích tại sao quan sát tuân theo mô hình. “Container đang up” chưa đủ bằng chứng. Hãy thêm kiểm tra ở mức ứng dụng, inspect Docker object liên quan và teardown stack khi hoàn thành. Chạy lại một lần từ trạng thái sạch nếu bài tập liên quan build hoặc persistence. Lần chạy thứ hai phát hiện phụ thuộc vô tình vào cache ấm, container cũ hoặc dữ liệu còn trên máy.

Review kết quả như thể đó là pull request của đồng đội. Kỹ sư mới có tìm thấy entry point không? Phiên bản và giả định có hiện rõ không? Dữ liệu nhạy cảm có nằm ngoài image và repository không? Có quan sát được lỗi mà không cần mở shell tương tác không? Cleanup có an toàn không? Một lệnh README ngắn hoặc Make target có thể hữu ích, nhưng chỉ thêm sau khi đã hiểu các lệnh Docker gốc.`,
    labels: {
      decision: 'Góc nhìn quyết định',
      invariants: 'Các bất biến cần giữ',
      files: 'Ví dụ thực hành',
      steps: 'Chạy và kiểm tra',
      review: 'Review vận hành',
      traps: 'Các lỗi thường gặp',
      tradeoff: 'Trade-off cần thảo luận',
      exercises: 'Bài tập',
      done: 'Bằng chứng hoàn thành',
    },
  },
};

function renderBody(language, content) {
  const copy = shared[language];
  const list = (items) => items.map((item) => `- ${item}`).join('\n');
  const exercises = content.exercises
    .map(
      (exercise, index) =>
        `${index + 1}. **${exercise.name}.** ${exercise.task}\n   - **${copy.labels.done}:** ${exercise.done}`,
    )
    .join('\n');

  return `## Why this matters

${content.why}

${copy.why}

### ${copy.labels.decision}

${content.decision}

## Mental model

${content.model}

${copy.model}

### ${copy.labels.invariants}

${list(content.invariants)}

## Walkthrough

${content.walkthrough}

${copy.walkthrough}

### ${copy.labels.files}

\`Dockerfile\`:

\`\`\`dockerfile
${content.dockerfile.trim()}
\`\`\`

\`compose.yaml\`:

\`\`\`yaml
${content.compose.trim()}
\`\`\`

### ${copy.labels.steps}

${list(content.steps)}

### ${copy.labels.review}

${content.review}

## Pitfalls & trade-offs

${copy.pitfalls}

### ${copy.labels.traps}

${list(content.pitfalls)}

### ${copy.labels.tradeoff}

${content.tradeoff}

## Practice / exercises

${copy.practice}

### ${copy.labels.exercises}

${exercises}
`;
}

function makeSection(definition) {
  return {
    id: definition.id,
    title: { en: definition.en.title, vn: definition.vn.title },
    baseline: { en: definition.en.baseline, vn: definition.vn.baseline },
    skills: { en: definition.en.skills, vn: definition.vn.skills },
    diagram: definition.id,
    body: {
      en: renderBody('en', definition.en),
      vn: renderBody('vn', definition.vn),
    },
  };
}

const sections = [
  makeSection({
    id: 'containers-vs-vms',
    en: {
      title: 'Containers vs VMs; mental model',
      baseline: [
        'Can explain processes, filesystems, ports, and environment variables',
        'Has run a service from a terminal and inspected its logs',
        'Understands that isolation is not the same as a security boundary',
      ],
      skills: [
        'Explain container isolation using host processes and Linux namespaces',
        'Choose between a process, container, and VM based on the required boundary',
        'Trace image, container, host, and network responsibilities during debugging',
      ],
      why: `Containers are often introduced as “lightweight virtual machines,” but that shortcut becomes harmful as soon as engineers debug performance, security, or persistence. A Linux container does not boot a guest kernel. The container's main process is a host process whose view of process IDs, mounts, hostname, users, and networks is restricted by namespaces. Control groups account for and limit resources. An image supplies a filesystem and metadata. This model explains why containers start quickly, why kernel compatibility matters, and why the host can still observe every container process.

The distinction affects architecture. A VM is useful when a workload needs a different kernel, a strong administrative boundary, or machine-level isolation. A container is useful when a team wants a repeatable userspace and process contract with efficient scheduling. A plain host process may be enough for a single-purpose system where packaging isolation adds no value. The decision should follow the boundary you need, not a slogan about speed.`,
      decision: `Ask four questions. Do workloads trust one another? Do they require different kernels or kernel settings? Which unit must be patched and audited? Which unit should scale and fail independently? Containers share the host kernel, so they reduce duplicate operating-system overhead but also share kernel risk. VMs virtualize hardware and run guest kernels, so they add boot and memory cost in exchange for a broader isolation boundary. In many production systems the answer is both: containers are scheduled inside VMs, giving teams an application-sized deployment unit and infrastructure teams a machine-sized tenancy boundary.`,
      model: `Picture a container as a configured process tree. PID 1 inside the container is the process Docker starts from \`ENTRYPOINT\` and \`CMD\`. If it exits, the container stops, even if it spawned work elsewhere. Signals sent by \`docker stop\` must reach that process so it can drain requests and exit before the grace period expires. The root filesystem starts from read-only image layers and receives a thin writable layer. Published ports are host forwarding rules; they are not sockets baked into the image. Environment variables and mounts arrive when the container is created.

This process-first view prevents two mistakes: trying to manage a container like a long-lived server with SSH and init scripts, and treating the writable layer like durable machine storage. Build the image to contain what the process needs, pass runtime choices at creation, keep durable state in managed storage, and replace containers instead of repairing them in place.`,
      invariants: [
        'A container shares the host kernel even when its process and mount views look private.',
        'The lifecycle follows the configured PID 1; backgrounding the real service usually breaks that contract.',
        'Deleting a container deletes its writable layer but does not delete a separately managed volume by default.',
        'EXPOSE documents a port; publishing decides whether the host forwards traffic to it.',
      ],
      walkthrough: `The example deliberately uses a tiny HTTP process. It proves that containerization changes the process view and filesystem packaging without creating a guest machine. The Dockerfile adds a static response and starts BusyBox HTTPD in the foreground. Compose publishes one host port and sets a small process limit. There is no SSH daemon, package manager at runtime, or system service manager because none is required for the one process contract.`,
      dockerfile: String.raw`
FROM busybox:1.36.1
RUN mkdir -p /www && printf 'container process\n' > /www/index.html
WORKDIR /www
EXPOSE 8080
USER 65534:65534
CMD ["httpd", "-f", "-p", "8080"]
`,
      compose: String.raw`
services:
  web:
    build: .
    ports:
      - "127.0.0.1:8080:8080"
    init: true
    pids_limit: 64
    read_only: true
`,
      steps: [
        'Run `docker compose build --pull`; inspect the final image size and note that no guest operating system was booted.',
        'Run `docker compose up -d`, then `curl http://127.0.0.1:8080` to verify the application contract.',
        'Run `docker compose top` and compare the process with `ps` on the host; it is namespaced, not hosted by a second kernel.',
        'Run `docker inspect` on the container and locate its command, user, mounts, port bindings, PID, and cgroup settings.',
        'Run `docker compose stop` and confirm the foreground process receives termination and the container reaches Exited.',
        'Run `docker compose down`; rebuild and recreate to prove there was no hand-maintained server state.',
      ],
      review: `Notice which controls are image choices and which are runtime choices. The image chooses BusyBox, the file, user, working directory, and default command. Compose chooses the host binding, init shim, PID ceiling, and read-only root. If the service needs a writable temporary directory, add an explicit tmpfs rather than making the entire root writable. If it needs a kernel feature not available on the host, changing the Dockerfile cannot provide a new kernel; that requirement belongs at the VM or host layer.`,
      pitfalls: [
        'Calling a container a VM leads engineers to install SSH, cron, and a service manager when one foreground process would be observable and replaceable.',
        'Running as root inside a namespace is not equivalent to being harmless; capabilities and kernel attack surface still matter.',
        'Using `--privileged` to fix a permissions problem discards most isolation controls and hides the actual requirement.',
        'Binding to `0.0.0.0` exposes a host port on more interfaces than a local-only development service needs.',
        'Assuming every container is disposable while storing data in its writable layer causes data loss during recreation.',
      ],
      tradeoff: `A container is not automatically the right unit for every process. Sidecars, tightly coupled workers, and debugging tools can add operational cost when split without a lifecycle reason. Conversely, putting an API, database, queue, and scheduler in one container couples scaling and failure. Choose the smallest independently deployable and observable service concern, then use multiple cooperating processes only when their lifecycle truly belongs together.`,
      exercises: [
        {
          name: 'Prove the shared kernel',
          task: 'Record the host kernel reported by `uname -r` and by `docker compose exec web uname -r`, then explain why matching output is expected.',
          done: 'Include both outputs and a two-sentence comparison with what a VM would report.',
        },
        {
          name: 'Observe PID 1',
          task: 'Replace the exec-form CMD with a shell-form command, stop the service, and compare signal handling and process trees. Restore the exec form afterward.',
          done: 'Capture `docker compose top` before each stop and explain which process received the signal.',
        },
        {
          name: 'Choose a boundary',
          task: 'Classify three workloads—untrusted customer code, an internal stateless API, and a legacy application requiring another kernel—as process, container, VM, or a combination.',
          done: 'State the trust, kernel, patching, and scaling assumptions behind each choice.',
        },
      ],
    },
    vn: {
      title: 'Container và VM; mô hình tư duy',
      baseline: [
        'Giải thích được process, filesystem, port và biến môi trường',
        'Đã chạy dịch vụ từ terminal và kiểm tra log',
        'Hiểu rằng cô lập không đồng nghĩa với một ranh giới bảo mật tuyệt đối',
      ],
      skills: [
        'Giải thích cô lập container bằng host process và Linux namespace',
        'Chọn process, container hoặc VM dựa trên ranh giới cần thiết',
        'Truy vết trách nhiệm của image, container, host và network khi debug',
      ],
      why: `Container thường được giới thiệu là “máy ảo nhẹ”, nhưng lối tắt đó gây hại khi debug hiệu năng, bảo mật hoặc persistence. Linux container không boot guest kernel. Process chính của container là một host process có góc nhìn về PID, mount, hostname, user và network bị giới hạn bởi namespace. Control group thống kê và giới hạn tài nguyên. Image cung cấp filesystem và metadata. Mô hình này giải thích vì sao container khởi động nhanh, vì sao tương thích kernel quan trọng và vì sao host vẫn quan sát được mọi process trong container.

Khác biệt này tác động trực tiếp đến kiến trúc. VM hữu ích khi workload cần kernel khác, ranh giới quản trị mạnh hoặc cô lập cấp máy. Container hữu ích khi đội ngũ muốn userspace và process contract có thể lặp lại với khả năng lập lịch hiệu quả. Host process thông thường có thể đủ cho hệ thống một mục đích, nơi cô lập đóng gói không thêm giá trị. Quyết định phải đi theo ranh giới cần có, không theo khẩu hiệu về tốc độ.`,
      decision: `Hỏi bốn câu: các workload có tin cậy nhau không; chúng có cần kernel hoặc thiết lập kernel khác nhau không; đơn vị nào cần được vá và audit; đơn vị nào cần scale và fail độc lập? Container chia sẻ host kernel nên giảm overhead hệ điều hành lặp lại nhưng cũng chia sẻ rủi ro kernel. VM ảo hóa phần cứng và chạy guest kernel nên tốn thêm thời gian boot và bộ nhớ để đổi lấy ranh giới cô lập rộng hơn. Nhiều hệ thống production dùng cả hai: container được lập lịch trong VM, tạo đơn vị triển khai cấp ứng dụng và ranh giới tenancy cấp máy.`,
      model: `Hãy hình dung container là một cây process đã cấu hình. PID 1 bên trong là process Docker khởi động từ \`ENTRYPOINT\` và \`CMD\`. Khi nó thoát, container dừng dù nó đã sinh công việc ở nơi khác. Signal từ \`docker stop\` phải đến được process này để drain request và thoát trước grace period. Root filesystem bắt đầu từ các image layer chỉ đọc và có một writable layer mỏng. Published port là quy tắc forward trên host, không phải socket được đóng vào image. Biến môi trường và mount được gắn khi container được tạo.

Góc nhìn process-first tránh hai lỗi: quản lý container như server sống lâu bằng SSH và init script; xem writable layer như storage bền vững của một máy. Hãy build image chứa đúng thứ process cần, truyền lựa chọn runtime lúc tạo, giữ state bền vững trong storage được quản lý và thay container thay vì sửa trực tiếp.`,
      invariants: [
        'Container chia sẻ host kernel dù góc nhìn process và mount trông riêng biệt.',
        'Vòng đời đi theo PID 1 đã cấu hình; chạy service thật ở background thường phá contract này.',
        'Xóa container xóa writable layer nhưng mặc định không xóa volume được quản lý riêng.',
        'EXPOSE chỉ tài liệu hóa port; publishing quyết định host có forward traffic hay không.',
      ],
      walkthrough: `Ví dụ cố ý dùng một HTTP process rất nhỏ. Nó chứng minh container hóa thay đổi góc nhìn process và cách đóng gói filesystem mà không tạo guest machine. Dockerfile thêm response tĩnh và chạy BusyBox HTTPD ở foreground. Compose publish một host port và đặt giới hạn process nhỏ. Không có SSH daemon, package manager lúc runtime hay service manager vì contract một process không cần chúng.`,
      dockerfile: String.raw`
FROM busybox:1.36.1
RUN mkdir -p /www && printf 'container process\n' > /www/index.html
WORKDIR /www
EXPOSE 8080
USER 65534:65534
CMD ["httpd", "-f", "-p", "8080"]
`,
      compose: String.raw`
services:
  web:
    build: .
    ports:
      - "127.0.0.1:8080:8080"
    init: true
    pids_limit: 64
    read_only: true
`,
      steps: [
        'Chạy `docker compose build --pull`; kiểm tra kích thước image cuối và ghi nhận không có guest OS nào được boot.',
        'Chạy `docker compose up -d`, rồi `curl http://127.0.0.1:8080` để xác minh contract ứng dụng.',
        'Chạy `docker compose top` và so sánh process với `ps` trên host; nó được namespaced chứ không chạy bởi kernel thứ hai.',
        'Chạy `docker inspect` cho container và tìm command, user, mount, port binding, PID cùng thiết lập cgroup.',
        'Chạy `docker compose stop` và xác nhận foreground process nhận termination rồi container chuyển sang Exited.',
        'Chạy `docker compose down`; rebuild và recreate để chứng minh không có trạng thái server được sửa tay.',
      ],
      review: `Hãy nhận ra control nào thuộc image, control nào thuộc runtime. Image chọn BusyBox, file, user, working directory và default command. Compose chọn host binding, init shim, trần PID và root chỉ đọc. Nếu dịch vụ cần thư mục tạm ghi được, thêm tmpfs rõ ràng thay vì cho toàn bộ root ghi được. Nếu nó cần kernel feature host không có, đổi Dockerfile không thể cung cấp kernel mới; yêu cầu đó thuộc lớp VM hoặc host.`,
      pitfalls: [
        'Gọi container là VM khiến kỹ sư cài SSH, cron và service manager trong khi một foreground process dễ quan sát và thay thế hơn.',
        'Chạy root trong namespace không có nghĩa là vô hại; capability và bề mặt tấn công kernel vẫn quan trọng.',
        'Dùng `--privileged` để sửa lỗi permission loại bỏ phần lớn control cô lập và che yêu cầu thật.',
        'Bind `0.0.0.0` công khai host port trên nhiều interface hơn dịch vụ local cần.',
        'Cho rằng container luôn disposable nhưng lưu dữ liệu ở writable layer sẽ gây mất dữ liệu khi recreate.',
      ],
      tradeoff: `Container không tự động là đơn vị đúng cho mọi process. Sidecar, worker gắn chặt và công cụ debug có thể thêm chi phí vận hành nếu bị tách mà không có lý do vòng đời. Ngược lại, đặt API, database, queue và scheduler trong một container sẽ ghép scaling và failure. Chọn service concern nhỏ nhất có thể deploy và quan sát độc lập; chỉ dùng nhiều process hợp tác khi vòng đời của chúng thực sự thuộc về nhau.`,
      exercises: [
        {
          name: 'Chứng minh kernel được chia sẻ',
          task: 'Ghi kernel host từ `uname -r` và trong `docker compose exec web uname -r`, rồi giải thích vì sao output giống nhau.',
          done: 'Có cả hai output và hai câu so sánh với điều VM sẽ báo.',
        },
        {
          name: 'Quan sát PID 1',
          task: 'Đổi exec-form CMD sang shell-form, dừng service và so sánh signal handling cùng process tree; sau đó khôi phục exec form.',
          done: 'Chụp `docker compose top` trước mỗi lần stop và giải thích process nào nhận signal.',
        },
        {
          name: 'Chọn ranh giới',
          task: 'Phân loại ba workload—mã khách hàng không tin cậy, API nội bộ stateless và ứng dụng cũ cần kernel khác—thành process, container, VM hoặc kết hợp.',
          done: 'Nêu giả định trust, kernel, patching và scaling cho từng lựa chọn.',
        },
      ],
    },
  }),
  makeSection({
    id: 'images-layers-dockerfile',
    en: {
      title: 'Images, layers, Dockerfile',
      baseline: [
        'Reads basic shell commands and package manifests',
        'Understands immutable artifacts and semantic version tags',
        'Can distinguish build-time dependencies from runtime dependencies',
      ],
      skills: [
        'Read image history and explain layer cache behavior',
        'Order Dockerfile instructions for correctness, cache reuse, and reviewability',
        'Define a safe runtime contract with USER, ENTRYPOINT, and CMD',
      ],
      why: `An image is the deployable artifact that links source review to runtime execution. If its contents depend on files copied from a workstation, an unpinned base, or a mutable package resolution, the same commit may behave differently across environments. A Dockerfile is therefore more than automation syntax: it is a reviewable statement of the filesystem, user, working directory, defaults, and build operations that define the service.

Layers matter because every filesystem-changing instruction creates content that can be reused by later builds and shared between images. Good ordering makes ordinary source edits cheap without hiding dependency changes. Bad ordering copies the entire repository before installing dependencies, invalidating expensive installation whenever any source file changes. Worse, deleting a secret in a later layer does not remove it from the earlier layer where it was first added.`,
      decision: `Separate choices by stability and responsibility. Pin the base to a deliberate version and, for high assurance, a digest. Copy lockfiles before application source so dependency installation can be cached. Use the package manager's reproducible install mode. Copy only required runtime files. Set the final user and command explicitly. Each instruction should answer either “what content belongs in this artifact?” or “what runtime default describes this artifact?” If an instruction exists only to repair an earlier broad copy, narrow the earlier instruction instead.`,
      model: `An image manifest references an ordered set of immutable filesystem layers plus configuration metadata. Docker identifies layer content by digest. A build step can reuse a cached result when its instruction and relevant inputs match; cache is an optimization, not evidence that dependencies are current. \`docker image history\` shows instruction boundaries and approximate sizes, while \`docker inspect\` shows config such as environment, user, entrypoint, and command.

\`ENTRYPOINT\` defines the executable contract; \`CMD\` commonly supplies default arguments. Exec form preserves argument boundaries and direct signal delivery. Shell form invokes a shell and should be chosen only when shell expansion is required. Runtime callers can replace CMD arguments easily, while replacing ENTRYPOINT is a stronger override. The combination should make the normal invocation obvious from image metadata.`,
      invariants: [
        'A later layer can hide a file but cannot erase bytes from an earlier distributed layer.',
        'Changing an instruction invalidates that result and the dependent instructions after it.',
        'Tags are human-readable references; digests identify immutable image content.',
        'Image configuration is a default contract and can be overridden when a container is created.',
      ],
      walkthrough: `This Node service demonstrates dependency-layer ordering without requiring a framework. The lockfiles are copied first and installed with \`npm ci\`; source arrives afterward. A non-root user runs the service. Compose builds the image and sets a runtime environment value without mutating the image. In a real repository, a matching \`.dockerignore\` should exclude \`node_modules\`, VCS metadata, logs, coverage, and local secret files.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node server.js ./
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build:
      context: .
    environment:
      PORT: "3000"
    ports:
      - "127.0.0.1:3000:3000"
    init: true
`,
      steps: [
        'Create a locked dependency set with `npm ci` locally only if the project does not already contain `package-lock.json`.',
        'Build once with `docker compose build --progress=plain` and identify the dependency-install layer in the output.',
        'Edit only `server.js`, rebuild, and verify the `npm ci` instruction is reused from cache.',
        'Edit `package-lock.json` through the package manager, rebuild, and verify dependency installation runs again.',
        'Use `docker image history` and `docker image inspect` to connect Dockerfile instructions to layers and config.',
        'Run the service, send it a request, stop it, and verify the Node process receives the stop signal through exec-form CMD.',
      ],
      review: `Review both content and metadata. Check that local modules cannot overwrite Linux modules, that package installation is reproducible, and that build tools are absent unless the runtime needs them. Look for credentials in COPY, ARG, ENV, and RUN instructions; all can leak through context, history, logs, metadata, or layers. Confirm the process user owns only the paths it must write. Finally, inspect architecture and base provenance rather than trusting a familiar tag name.`,
      pitfalls: [
        'Using `latest` gives no stable statement of the base or application version and makes rollback ambiguous.',
        'Combining unrelated operations in one enormous RUN instruction can save layers while making cache behavior and failures harder to review.',
        'Splitting package update and package install across layers can cache stale indexes and create inconsistent package resolution.',
        'Copying the whole repository before dependency installation destroys a valuable cache boundary.',
        'Placing tokens in ARG or ENV assumes build metadata is secret storage; it is not.',
      ],
      tradeoff: `More layers are not automatically worse. Modern content-addressed storage deduplicates shared layers, and clear Dockerfile boundaries improve cache reuse and review. Combining package-manager update, install, and cleanup in one RUN is sensible because those operations form one correctness unit. Combining compilation, unrelated downloads, user creation, and diagnostics merely to reduce a layer count sacrifices clarity for a metric that rarely predicts runtime quality.`,
      exercises: [
        {
          name: 'Map the image',
          task: 'Build the example and annotate every `docker image history` row with the Dockerfile instruction and whether it changes filesystem content or config.',
          done: 'Provide the annotated history and explain why some metadata instructions report zero bytes.',
        },
        {
          name: 'Measure cache boundaries',
          task: 'Time a clean build, a source-only rebuild, and a lockfile rebuild while retaining plain build output.',
          done: 'Show which instructions were cached in each run and explain the timing difference.',
        },
        {
          name: 'Harden the contract',
          task: 'Run `docker inspect` and verify user, entrypoint, command, working directory, and environment against a written expected contract.',
          done: 'List every inspected value and correct at least one deliberately introduced mismatch.',
        },
      ],
    },
    vn: {
      title: 'Image, layer và Dockerfile',
      baseline: [
        'Đọc được shell command và package manifest cơ bản',
        'Hiểu artifact bất biến và semantic version tag',
        'Phân biệt dependency lúc build với dependency lúc runtime',
      ],
      skills: [
        'Đọc image history và giải thích hành vi layer cache',
        'Sắp xếp Dockerfile vì tính đúng, cache reuse và khả năng review',
        'Định nghĩa runtime contract an toàn bằng USER, ENTRYPOINT và CMD',
      ],
      why: `Image là artifact triển khai nối source review với runtime execution. Nếu nội dung của nó phụ thuộc file copy từ workstation, base không pin hoặc package resolution thay đổi được, cùng một commit có thể chạy khác giữa các môi trường. Vì vậy Dockerfile không chỉ là cú pháp tự động hóa; nó là phát biểu có thể review về filesystem, user, working directory, default và build operation định nghĩa dịch vụ.

Layer quan trọng vì mỗi instruction thay đổi filesystem tạo nội dung có thể tái sử dụng bởi build sau và chia sẻ giữa các image. Thứ tự tốt làm edit source thông thường rẻ mà không che dependency change. Thứ tự xấu copy toàn repository trước khi cài dependency, khiến cài đặt tốn kém bị invalidated mỗi khi bất kỳ source file đổi. Nguy hiểm hơn, xóa secret ở layer sau không loại bỏ nó khỏi layer trước nơi secret từng được thêm.`,
      decision: `Tách lựa chọn theo độ ổn định và trách nhiệm. Pin base vào phiên bản có chủ ý và với mức đảm bảo cao thì pin digest. Copy lockfile trước source để cache dependency installation. Dùng chế độ cài tái lập của package manager. Chỉ copy file runtime cần. Đặt final user và command rõ ràng. Mỗi instruction phải trả lời “nội dung nào thuộc artifact?” hoặc “runtime default nào mô tả artifact?”. Nếu instruction chỉ tồn tại để sửa một COPY quá rộng trước đó, hãy thu hẹp COPY.`,
      model: `Image manifest tham chiếu tập layer filesystem bất biến có thứ tự cùng configuration metadata. Docker nhận diện nội dung layer bằng digest. Build step có thể dùng cache khi instruction và input liên quan khớp; cache là tối ưu, không phải bằng chứng dependency mới. \`docker image history\` cho thấy ranh giới instruction và kích thước gần đúng; \`docker inspect\` cho config như environment, user, entrypoint và command.

\`ENTRYPOINT\` định nghĩa executable contract; \`CMD\` thường cung cấp default argument. Exec form giữ ranh giới argument và truyền signal trực tiếp. Shell form gọi shell và chỉ nên dùng khi cần shell expansion. Runtime caller dễ thay CMD argument, còn thay ENTRYPOINT là override mạnh hơn. Kết hợp này cần làm invocation bình thường rõ ngay từ image metadata.`,
      invariants: [
        'Layer sau có thể che file nhưng không xóa byte khỏi layer đã phân phối trước đó.',
        'Đổi một instruction làm invalid kết quả đó và các instruction phụ thuộc phía sau.',
        'Tag là tham chiếu dễ đọc; digest định danh nội dung image bất biến.',
        'Image configuration là default contract và có thể override khi tạo container.',
      ],
      walkthrough: `Dịch vụ Node này minh họa thứ tự dependency layer mà không cần framework. Lockfile được copy trước và cài bằng \`npm ci\`; source đến sau. User không phải root chạy dịch vụ. Compose build image và đặt runtime environment mà không mutate image. Trong repository thật, \`.dockerignore\` tương ứng cần loại \`node_modules\`, metadata VCS, log, coverage và secret file local.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --chown=node:node server.js ./
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build:
      context: .
    environment:
      PORT: "3000"
    ports:
      - "127.0.0.1:3000:3000"
    init: true
`,
      steps: [
        'Chỉ tạo dependency lock bằng `npm ci` local nếu project chưa có `package-lock.json`.',
        'Build bằng `docker compose build --progress=plain` và tìm dependency-install layer trong output.',
        'Chỉ sửa `server.js`, rebuild và xác nhận instruction `npm ci` được dùng lại từ cache.',
        'Sửa `package-lock.json` qua package manager, rebuild và xác nhận dependency installation chạy lại.',
        'Dùng `docker image history` và `docker image inspect` để nối Dockerfile instruction với layer và config.',
        'Chạy service, gửi request, stop và xác minh Node process nhận stop signal qua exec-form CMD.',
      ],
      review: `Review cả content lẫn metadata. Kiểm tra local module không ghi đè Linux module, package installation tái lập được và build tool không còn nếu runtime không cần. Tìm credential trong COPY, ARG, ENV và RUN; tất cả có thể rò qua context, history, log, metadata hoặc layer. Xác nhận process user chỉ sở hữu path phải ghi. Cuối cùng, kiểm tra architecture và nguồn base thay vì tin tag quen thuộc.`,
      pitfalls: [
        'Dùng `latest` không tạo phát biểu ổn định về base hay application version và làm rollback mơ hồ.',
        'Gộp operation không liên quan vào một RUN khổng lồ có thể giảm layer nhưng làm cache và lỗi khó review.',
        'Tách package update và install qua nhiều layer có thể cache index cũ và tạo resolution không nhất quán.',
        'Copy cả repository trước dependency installation phá ranh giới cache giá trị.',
        'Đặt token trong ARG hoặc ENV giả định build metadata là secret storage; thực tế không phải.',
      ],
      tradeoff: `Nhiều layer hơn không tự động tệ. Storage theo content hiện đại deduplicate layer dùng chung, còn ranh giới Dockerfile rõ giúp cache và review. Gộp update, install và cleanup của package manager trong một RUN hợp lý vì chúng là một đơn vị đúng đắn. Gộp compilation, download không liên quan, tạo user và diagnostic chỉ để giảm layer sẽ hy sinh rõ ràng cho một metric hiếm khi dự báo chất lượng runtime.`,
      exercises: [
        {
          name: 'Lập bản đồ image',
          task: 'Build ví dụ và chú thích mỗi dòng `docker image history` bằng Dockerfile instruction cùng việc nó đổi filesystem hay config.',
          done: 'Có history đã chú thích và giải thích vì sao một số metadata instruction báo zero byte.',
        },
        {
          name: 'Đo ranh giới cache',
          task: 'Đo clean build, source-only rebuild và lockfile rebuild, giữ lại plain build output.',
          done: 'Cho thấy instruction nào cached trong mỗi lần và giải thích chênh lệch thời gian.',
        },
        {
          name: 'Làm cứng contract',
          task: 'Chạy `docker inspect`, xác minh user, entrypoint, command, working directory và environment với contract kỳ vọng đã viết.',
          done: 'Liệt kê mọi giá trị inspect và sửa ít nhất một mismatch được cố ý đưa vào.',
        },
      ],
    },
  }),
  makeSection({
    id: 'build-context-multistage',
    en: {
      title: 'Build context, multi-stage builds',
      baseline: [
        'Can write a basic Dockerfile and use a lockfile',
        'Understands compilation artifacts and runtime dependencies',
        'Can identify files that should never leave a developer machine',
      ],
      skills: [
        'Minimize and audit the build context with .dockerignore',
        'Use named multi-stage targets to separate build, test, and runtime concerns',
        'Apply cache and secret mounts without persisting sensitive inputs',
      ],
      why: `The build context is the data boundary sent to the builder. Before a single COPY runs, the client may package files beneath the context root and make them available to build instructions. A broad context wastes transfer time and can expose credentials, editor state, test output, or local dependency trees to a remote builder. A Dockerfile outside the intended context cannot compensate for sending the wrong files. Context selection and \`.dockerignore\` are therefore security and performance controls.

Multi-stage builds solve a different boundary: a compiler and package manager may be necessary to produce an artifact but unnecessary to run it. Named stages let one Dockerfile describe dependency restoration, testing, compilation, and a narrow runtime copy. The final image receives only selected artifacts. This reduces size and attack surface while retaining a reproducible build path.`,
      decision: `Choose the smallest context root that contains every legitimate build input, then deny noisy or sensitive paths with \`.dockerignore\`. Do not set the repository root as context merely because it is convenient if the service occupies one subdirectory. In the Dockerfile, create stages around artifact boundaries, not around every command. A dependencies stage can cache lockfile resolution, a build stage can compile, a test target can execute validation, and a runtime stage can copy the output. Name stages so later COPY instructions survive reordering.`,
      model: `BuildKit evaluates a directed graph of stages and instructions. \`FROM ... AS build\` creates a stage root. \`COPY --from=build\` transfers selected filesystem content, not the build stage's command history or environment. An unused stage may be skipped. A target can stop the graph at a named stage, which is useful for CI tests without bloating the runtime image.

Context is separate from stage filesystems. \`COPY\` reads from context unless \`--from\` names another stage, image, or build context. Cache mounts preserve package-manager caches for the builder without copying them into the image layer. Secret and SSH mounts expose values only to a RUN instruction and are preferable to ARG, but the command must avoid copying or printing them. The final image should be explainable by enumerating its explicit COPY operations.`,
      invariants: [
        'The builder cannot COPY a path outside the selected context.',
        '.dockerignore reduces what enters the context; deleting files in a RUN step is too late.',
        'Only explicitly copied artifacts cross from a build stage into a clean runtime stage.',
        'A BuildKit secret mount prevents automatic persistence, but the build command can still leak the value.',
      ],
      walkthrough: `The example compiles a TypeScript service and leaves the compiler and development dependencies behind. The dependency stage uses a cache mount for npm's download cache. The build stage creates \`dist\`. The runtime stage installs only production dependencies and copies compiled output with correct ownership. Compose points at the service directory and names the runtime target, making the intended output explicit.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS deps
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22.12.0-alpine3.21 AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
USER node
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  api:
    build:
      context: ./services/api
      dockerfile: Dockerfile
      target: runtime
    ports:
      - "127.0.0.1:3000:3000"
`,
      steps: [
        'Create `.dockerignore` beside the context with `.git`, `node_modules`, `dist`, coverage, logs, `.env*`, and editor files.',
        'Run `docker compose build --progress=plain` and inspect the context-transfer size before evaluating layer cache hits.',
        'Build the `build` target and run tests there; separately build `runtime` and compare installed binaries and image sizes.',
        'Change one source file and verify dependency restoration remains cached while compilation runs again.',
        'Inspect the runtime filesystem and prove TypeScript source, compiler, npm cache, and development modules are absent.',
        'Run a no-cache build once to distinguish correctness from a result accidentally supplied by local cache.',
      ],
      review: `A small final size is useful but incomplete evidence. Inspect the image's actual files and packages. Verify the compiled artifact does not require a native library available only in the builder. If stages use different Linux distributions or C libraries, copied native binaries may fail at runtime. Keep build and runtime bases compatible unless the artifact is demonstrably self-contained. In CI, record the target, platform, Dockerfile path, context, and build arguments so the artifact can be reproduced.`,
      pitfalls: [
        'A `.dockerignore` pattern is relative to context semantics, not an arbitrary Dockerfile location; test what is actually sent.',
        'Using `COPY . .` in an early stage can invalidate dependency cache and make unintended files available to later commands.',
        'Copying an entire build-stage directory into runtime reintroduces caches, source, and tools that stages were meant to exclude.',
        'Passing private registry tokens through ARG or writing them into npm configuration leaves recoverable build evidence.',
        'Compiling for the builder architecture without declaring target platform can produce an image that fails on another architecture.',
      ],
      tradeoff: `One Dockerfile with several named targets keeps artifact flow visible, but it can become tangled if unrelated products share little. Split Dockerfiles when services have different contexts or release lifecycles, not merely because the file has multiple stages. Cache mounts accelerate builds but make cold CI behavior less visible; periodically run a clean build and keep lockfiles authoritative so cache improves speed without becoming an undeclared input.`,
      exercises: [
        {
          name: 'Audit context',
          task: 'Place harmless sentinel files in ignored and non-ignored paths, run a plain build, and verify only intended input is available.',
          done: 'Submit `.dockerignore`, context size before and after, and proof the ignored sentinel cannot be copied.',
        },
        {
          name: 'Compare targets',
          task: 'Build the `build` and `runtime` targets, then inspect package lists, files, user, and image sizes.',
          done: 'Produce a table explaining every material difference and why runtime needs the remaining content.',
        },
        {
          name: 'Test artifact compatibility',
          task: 'Add one native dependency, compile it in the build stage, and verify it starts in runtime; then explain libc and architecture assumptions.',
          done: 'Include the runtime check and either a compatible pin or a documented failure with root cause.',
        },
      ],
    },
    vn: {
      title: 'Build context và multi-stage build',
      baseline: [
        'Viết được Dockerfile cơ bản và dùng lockfile',
        'Hiểu compilation artifact và runtime dependency',
        'Nhận diện file không bao giờ nên rời máy developer',
      ],
      skills: [
        'Thu nhỏ và audit build context bằng .dockerignore',
        'Dùng named multi-stage target để tách build, test và runtime',
        'Áp dụng cache mount và secret mount mà không lưu input nhạy cảm',
      ],
      why: `Build context là ranh giới dữ liệu gửi đến builder. Trước khi một COPY chạy, client có thể đóng gói file dưới context root và cho build instruction truy cập. Context rộng làm tốn thời gian truyền và có thể lộ credential, editor state, test output hoặc local dependency tree cho remote builder. Dockerfile nằm ngoài context dự kiến không thể bù cho việc gửi sai file. Chọn context và \`.dockerignore\` vì vậy là control bảo mật và hiệu năng.

Multi-stage build giải quyết ranh giới khác: compiler và package manager có thể cần để tạo artifact nhưng không cần để chạy. Named stage cho phép một Dockerfile mô tả dependency restoration, testing, compilation và runtime copy hẹp. Final image chỉ nhận artifact đã chọn. Điều này giảm kích thước và attack surface mà vẫn giữ đường build tái lập.`,
      decision: `Chọn context root nhỏ nhất chứa mọi build input hợp lệ, rồi loại path ồn hoặc nhạy cảm bằng \`.dockerignore\`. Không dùng repository root chỉ vì tiện nếu service nằm trong một subdirectory. Trong Dockerfile, tạo stage quanh ranh giới artifact, không phải quanh từng command. Dependencies stage cache lockfile resolution, build stage compile, test target chạy validation và runtime stage copy output. Đặt tên stage để COPY phía sau không phụ thuộc thứ tự số.`,
      model: `BuildKit đánh giá đồ thị có hướng của stage và instruction. \`FROM ... AS build\` tạo stage root. \`COPY --from=build\` truyền filesystem content được chọn, không truyền command history hay environment của build stage. Stage không dùng có thể bị bỏ qua. Target có thể dừng graph tại stage có tên, hữu ích cho CI test mà không làm runtime image phình.

Context tách khỏi stage filesystem. \`COPY\` đọc từ context trừ khi \`--from\` chỉ stage, image hoặc build context khác. Cache mount giữ cache package manager cho builder mà không copy vào image layer. Secret và SSH mount chỉ đưa giá trị vào một RUN instruction và tốt hơn ARG, nhưng command vẫn phải tránh copy hay in secret. Final image cần giải thích được bằng cách liệt kê các COPY rõ ràng.`,
      invariants: [
        'Builder không thể COPY path ngoài context đã chọn.',
        '.dockerignore giảm dữ liệu vào context; xóa file trong RUN là quá muộn.',
        'Chỉ artifact được copy rõ ràng mới đi từ build stage sang runtime stage sạch.',
        'BuildKit secret mount ngăn lưu tự động, nhưng build command vẫn có thể làm rò giá trị.',
      ],
      walkthrough: `Ví dụ compile TypeScript service và bỏ compiler cùng development dependency lại. Dependency stage dùng cache mount cho npm download cache. Build stage tạo \`dist\`. Runtime stage chỉ cài production dependency và copy compiled output với ownership đúng. Compose trỏ vào service directory và gọi runtime target, làm output dự kiến rõ ràng.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS deps
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22.12.0-alpine3.21 AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
USER node
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  api:
    build:
      context: ./services/api
      dockerfile: Dockerfile
      target: runtime
    ports:
      - "127.0.0.1:3000:3000"
`,
      steps: [
        'Tạo `.dockerignore` cạnh context với `.git`, `node_modules`, `dist`, coverage, log, `.env*` và editor file.',
        'Chạy `docker compose build --progress=plain`, kiểm tra kích thước context transfer trước khi xem cache hit.',
        'Build target `build` và chạy test trong đó; build riêng `runtime`, so sánh binary cài đặt và image size.',
        'Đổi một source file và xác nhận dependency restoration còn cached trong khi compilation chạy lại.',
        'Inspect runtime filesystem, chứng minh TypeScript source, compiler, npm cache và development module không còn.',
        'Chạy một no-cache build để phân biệt tính đúng với kết quả vô tình đến từ local cache.',
      ],
      review: `Final size nhỏ hữu ích nhưng chưa đủ. Inspect file và package thật trong image. Xác minh compiled artifact không cần native library chỉ có ở builder. Nếu stage dùng distribution hoặc C library khác, native binary copy sang có thể fail. Giữ build và runtime base tương thích trừ khi artifact chắc chắn self-contained. Trong CI, ghi target, platform, Dockerfile path, context và build argument để tái lập artifact.`,
      pitfalls: [
        'Pattern `.dockerignore` theo semantics của context, không theo Dockerfile location tùy ý; cần kiểm tra dữ liệu thực sự gửi.',
        'Dùng `COPY . .` trong stage sớm làm invalid dependency cache và đưa file ngoài ý muốn cho command sau.',
        'Copy cả directory build-stage vào runtime đưa cache, source và tool trở lại, phá mục tiêu của stage.',
        'Truyền private registry token qua ARG hoặc ghi vào npm config để lại bằng chứng build có thể phục hồi.',
        'Compile theo architecture của builder mà không khai target platform có thể tạo image fail trên architecture khác.',
      ],
      tradeoff: `Một Dockerfile nhiều named target giữ artifact flow rõ, nhưng có thể rối nếu sản phẩm không liên quan dùng chung ít thứ. Tách Dockerfile khi service có context hoặc release lifecycle khác, không chỉ vì file có nhiều stage. Cache mount tăng tốc build nhưng che cold CI behavior; định kỳ chạy clean build và giữ lockfile làm nguồn chuẩn để cache chỉ tối ưu tốc độ, không thành input ngầm.`,
      exercises: [
        {
          name: 'Audit context',
          task: 'Đặt sentinel file vô hại trong path ignored và non-ignored, chạy plain build và xác minh chỉ input dự kiến truy cập được.',
          done: 'Nộp `.dockerignore`, context size trước/sau và bằng chứng sentinel bị ignore không copy được.',
        },
        {
          name: 'So sánh target',
          task: 'Build target `build` và `runtime`, rồi inspect package list, file, user và image size.',
          done: 'Tạo bảng giải thích mọi khác biệt quan trọng và vì sao runtime cần nội dung còn lại.',
        },
        {
          name: 'Kiểm tra tương thích artifact',
          task: 'Thêm một native dependency, compile ở build stage và xác minh nó start trong runtime; giải thích giả định libc và architecture.',
          done: 'Có runtime check và pin tương thích hoặc failure được ghi cùng root cause.',
        },
      ],
    },
  }),
  makeSection({
    id: 'volumes-persistence',
    en: {
      title: 'Volumes & persistence',
      baseline: [
        'Understands files, directories, ownership, and database durability',
        'Can distinguish application state from application binaries',
        'Has performed a basic backup and restore outside Docker',
      ],
      skills: [
        'Choose among image content, writable layers, bind mounts, volumes, and tmpfs',
        'Design ownership, backup, restore, and migration procedures for persistent data',
        'Test container replacement without accidental data loss',
      ],
      why: `Containers are replaceable; important data is not. The writable container layer is convenient for transient changes but follows the container lifecycle and is awkward to back up, move, or inspect independently. A named volume has its own Docker-managed lifecycle. A bind mount maps a host path and exposes host layout and permissions. A tmpfs keeps ephemeral data in memory. Choosing among them is an explicit data architecture decision, not a syntax preference.

Persistence also includes ownership, consistency, migration, recovery objectives, and deletion policy. Mounting a volume only answers where bytes live. It does not guarantee that database pages are consistent, that a restore works, that schema versions match the application, or that \`docker compose down -v\` is safe. A mid-level engineer should be able to identify every stateful path and explain how it is created, protected, upgraded, backed up, restored, and retired.`,
      decision: `Classify each path. Immutable application files belong in the image. Disposable caches and sockets can use the writable layer or tmpfs with explicit size limits. Source bind mounts are useful for local development where host editing is the feature. Service data should usually use a named volume locally and a managed storage service or orchestrator volume in production. Configuration and secrets deserve their own mechanisms. Avoid mounting over directories containing required image files unless replacement is deliberate.`,
      model: `Docker assembles a container mount namespace from image layers plus runtime mounts. A mount obscures the image path beneath it for that container. A fresh named volume mounted over a non-empty image directory may be populated by engine behavior, but relying on implicit copy-up makes initialization hard to reason about. Prefer applications and entrypoints that initialize explicitly and idempotently.

Volume names are scoped by Compose project unless an external name is declared. \`docker compose down\` removes containers and the default network but retains named volumes; \`down -v\` removes project volumes and is destructive. Backups must use application-consistent tools when the service has in-memory or transactional state. Copying live database files may produce a backup that exists but cannot recover.`,
      invariants: [
        'A mount hides image content at the same container path while the mount is present.',
        'Container removal does not imply named-volume removal, but explicit volume removal is irreversible without backup.',
        'Filesystem permissions are evaluated using numeric identities, even when user names differ between host and image.',
        'A backup is not proven until a restore into an independent clean volume passes application checks.',
      ],
      walkthrough: `PostgreSQL makes persistence behavior visible. Its data directory lives in a named volume, while a one-off backup profile writes a logical dump to a host backup directory. The application image is only a small client that waits for and queries the database; it does not store database files. The example uses a development password solely to make commands runnable—production credentials belong to the configuration and secrets section.`,
      dockerfile: String.raw`
FROM postgres:17.2-alpine
RUN printf '#!/bin/sh\nset -eu\nexec psql "$DATABASE_URL" -c "select now();"\n' \
    > /usr/local/bin/check-db \
 && chmod 0555 /usr/local/bin/check-db
USER postgres
ENTRYPOINT ["check-db"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-only
    volumes:
      - db-data:/var/lib/postgresql/data
  check:
    build: .
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    depends_on:
      - db
  backup:
    image: postgres:17.2-alpine
    profiles: ["tools"]
    environment:
      PGPASSWORD: local-only
    volumes:
      - ./backups:/backups
    command: ["pg_dump", "-h", "db", "-U", "app", "-f", "/backups/app.sql", "app"]
volumes:
  db-data:
`,
      steps: [
        'Start `db`, create a table and row with `docker compose exec db psql`, then record the project volume name.',
        'Run `docker compose down`, start again, and query the row to prove container replacement is independent of volume lifetime.',
        'Run the backup profile with `docker compose --profile tools run --rm backup` and inspect the logical SQL dump.',
        'Restore the dump into a newly named empty volume and query it through a fresh database container.',
        'Inspect volume mountpoint and labels without editing engine-managed files directly.',
        'Only after the restore test, run `docker compose down -v` and explain exactly which data is deleted.',
      ],
      review: `The backup bind mount is intentionally visible to the host, while database pages remain engine-managed. A logical dump is portable and consistent but may restore more slowly than a physical backup for a large database. Real systems should define retention, encryption, off-host copies, monitoring, recovery point objective, and recovery time objective. Also test upgrades: a data directory initialized by one major database version cannot be assumed compatible with another image tag.`,
      pitfalls: [
        'Bind-mounting a host directory over `/app` can hide dependencies copied into the image and create “works only in Compose” behavior.',
        'Running the process with a UID that cannot write the mounted path causes failures often misdiagnosed as Docker bugs.',
        'Using anonymous volumes makes lifecycle and cleanup less discoverable than a deliberately named volume.',
        'Copying live database files with `cp` or `tar` ignores database consistency rules.',
        'Treating `down -v` as routine cleanup can erase the only development dataset or an untested local recovery source.',
      ],
      tradeoff: `Bind mounts maximize host interoperability but couple containers to host paths, operating-system semantics, and ownership. Named volumes reduce that coupling and are easy for Docker to attach, but they are less directly browsable. For production databases, a managed service often provides stronger backup, replication, patching, and recovery than a volume attached to a single container host. The right choice follows durability and recovery requirements, not local convenience.`,
      exercises: [
        {
          name: 'Replacement test',
          task: 'Create data, force-remove the database container, recreate it, and verify the data through SQL rather than by listing volume files.',
          done: 'Show container IDs before and after, the stable volume identity, and the successful query.',
        },
        {
          name: 'Restore rehearsal',
          task: 'Produce a logical backup and restore it into a separate volume with a different Compose project name.',
          done: 'Run row-count and schema checks against the restored instance and record restore duration.',
        },
        {
          name: 'Mount selection review',
          task: 'Classify source, dependencies, uploads, database pages, cache, TLS keys, and temporary sockets by storage mechanism.',
          done: 'Justify lifecycle, permissions, backup, and deletion policy for each path.',
        },
      ],
    },
    vn: {
      title: 'Volume và dữ liệu bền vững',
      baseline: [
        'Hiểu file, directory, ownership và độ bền database',
        'Phân biệt application state với application binary',
        'Đã thực hiện backup và restore cơ bản ngoài Docker',
      ],
      skills: [
        'Chọn giữa image content, writable layer, bind mount, volume và tmpfs',
        'Thiết kế ownership, backup, restore và migration cho dữ liệu bền vững',
        'Kiểm thử thay container mà không vô tình mất dữ liệu',
      ],
      why: `Container có thể thay thế; dữ liệu quan trọng thì không. Writable container layer tiện cho thay đổi tạm nhưng đi theo vòng đời container và khó backup, di chuyển hay inspect độc lập. Named volume có vòng đời riêng do Docker quản lý. Bind mount ánh xạ host path và làm lộ layout cùng permission của host. Tmpfs giữ dữ liệu tạm trong memory. Chọn chúng là quyết định kiến trúc dữ liệu rõ ràng, không phải sở thích cú pháp.

Persistence còn gồm ownership, consistency, migration, recovery objective và deletion policy. Mount volume chỉ trả lời byte nằm ở đâu. Nó không đảm bảo database page nhất quán, restore hoạt động, schema version khớp app hay \`docker compose down -v\` an toàn. Kỹ sư mid-level cần nhận diện mọi stateful path và giải thích cách nó được tạo, bảo vệ, nâng cấp, backup, restore và retire.`,
      decision: `Phân loại từng path. Application file bất biến thuộc image. Cache và socket disposable có thể dùng writable layer hoặc tmpfs với size limit. Source bind mount hữu ích cho local development nơi chỉnh sửa từ host là mục tiêu. Service data thường dùng named volume ở local và managed storage hoặc orchestrator volume ở production. Configuration và secret cần cơ chế riêng. Tránh mount đè directory chứa image file bắt buộc trừ khi thay thế là chủ ý.`,
      model: `Docker lắp mount namespace của container từ image layer và runtime mount. Mount che image path bên dưới đối với container đó. Named volume mới mount lên image directory không rỗng có thể được engine populate, nhưng dựa vào copy-up ngầm làm initialization khó suy luận. Ưu tiên application và entrypoint initialize rõ ràng, idempotent.

Volume name được scope theo Compose project trừ khi khai external name. \`docker compose down\` xóa container và default network nhưng giữ named volume; \`down -v\` xóa project volume và có tính phá hủy. Backup phải dùng tool đảm bảo application consistency khi service có transactional state hoặc state trong memory. Copy database file đang chạy có thể tạo backup tồn tại nhưng không recovery được.`,
      invariants: [
        'Mount che image content tại cùng container path khi mount tồn tại.',
        'Xóa container không đồng nghĩa xóa named volume, nhưng explicit volume removal không đảo ngược nếu thiếu backup.',
        'Filesystem permission dùng numeric identity dù user name khác giữa host và image.',
        'Backup chưa được chứng minh cho tới khi restore vào volume sạch độc lập và qua application check.',
      ],
      walkthrough: `PostgreSQL làm hành vi persistence rõ. Data directory nằm trong named volume, còn profile backup một lần ghi logical dump vào host backup directory. Application image chỉ là client nhỏ chờ và query database; nó không lưu database file. Ví dụ dùng development password để command chạy được—credential production thuộc phần configuration và secret.`,
      dockerfile: String.raw`
FROM postgres:17.2-alpine
RUN printf '#!/bin/sh\nset -eu\nexec psql "$DATABASE_URL" -c "select now();"\n' \
    > /usr/local/bin/check-db \
 && chmod 0555 /usr/local/bin/check-db
USER postgres
ENTRYPOINT ["check-db"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-only
    volumes:
      - db-data:/var/lib/postgresql/data
  check:
    build: .
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    depends_on:
      - db
  backup:
    image: postgres:17.2-alpine
    profiles: ["tools"]
    environment:
      PGPASSWORD: local-only
    volumes:
      - ./backups:/backups
    command: ["pg_dump", "-h", "db", "-U", "app", "-f", "/backups/app.sql", "app"]
volumes:
  db-data:
`,
      steps: [
        'Start `db`, tạo table và row bằng `docker compose exec db psql`, rồi ghi project volume name.',
        'Chạy `docker compose down`, start lại và query row để chứng minh replacement container độc lập với lifetime volume.',
        'Chạy backup profile bằng `docker compose --profile tools run --rm backup` và inspect logical SQL dump.',
        'Restore dump vào một empty volume có tên mới và query qua database container mới.',
        'Inspect volume mountpoint và label mà không sửa trực tiếp engine-managed file.',
        'Chỉ sau restore test mới chạy `docker compose down -v` và giải thích chính xác data nào bị xóa.',
      ],
      review: `Backup bind mount cố ý nhìn thấy từ host, trong khi database page do engine quản lý. Logical dump portable và consistent nhưng có thể restore chậm hơn physical backup với database lớn. Hệ thống thật cần retention, encryption, off-host copy, monitoring, recovery point objective và recovery time objective. Cũng phải test upgrade: data directory khởi tạo bởi major database version này không được mặc định tương thích với image tag version khác.`,
      pitfalls: [
        'Bind mount host directory lên `/app` có thể che dependency trong image và tạo hành vi “chỉ chạy trong Compose”.',
        'Chạy process với UID không ghi được mounted path gây lỗi thường bị chẩn đoán sai là Docker bug.',
        'Dùng anonymous volume làm vòng đời và cleanup khó thấy hơn named volume có chủ ý.',
        'Copy live database file bằng `cp` hoặc `tar` bỏ qua quy tắc consistency của database.',
        'Xem `down -v` là cleanup thường nhật có thể xóa dataset development duy nhất hoặc nguồn recovery local chưa test.',
      ],
      tradeoff: `Bind mount tối đa khả năng tương tác với host nhưng ghép container vào host path, OS semantics và ownership. Named volume giảm coupling và dễ attach bằng Docker nhưng khó browse trực tiếp hơn. Với production database, managed service thường cung cấp backup, replication, patching và recovery mạnh hơn volume gắn vào một container host. Lựa chọn đúng đi theo yêu cầu durability và recovery, không theo tiện lợi local.`,
      exercises: [
        {
          name: 'Kiểm thử replacement',
          task: 'Tạo data, force-remove database container, recreate và xác minh data qua SQL thay vì list volume file.',
          done: 'Cho container ID trước/sau, volume identity ổn định và query thành công.',
        },
        {
          name: 'Diễn tập restore',
          task: 'Tạo logical backup và restore vào volume riêng với Compose project name khác.',
          done: 'Chạy row-count và schema check trên instance restore và ghi thời lượng.',
        },
        {
          name: 'Review lựa chọn mount',
          task: 'Phân loại source, dependency, upload, database page, cache, TLS key và temporary socket theo cơ chế storage.',
          done: 'Biện minh lifecycle, permission, backup và deletion policy cho mỗi path.',
        },
      ],
    },
  }),
  makeSection({
    id: 'networking',
    en: {
      title: 'Networking',
      baseline: [
        'Understands IP addresses, TCP ports, DNS, and localhost',
        'Can use curl or a database client to test a service',
        'Knows that listening and publishing are separate operations',
      ],
      skills: [
        'Use Compose service discovery and container ports correctly',
        'Limit host exposure and segment traffic with purpose-specific networks',
        'Diagnose name resolution, bind-address, protocol, and port mapping failures',
      ],
      why: `Container networking becomes simple once each network namespace is treated as its own machine-like network view. Inside an API container, \`localhost\` means the API container itself, not the database container and not the laptop. Services on a shared Compose network reach one another by service name and container port. Host port publishing is needed only when traffic must cross from the host or an external client into that network.

This distinction is both operational and security-relevant. Publishing every database, cache, and broker port increases collision risk and exposes services beyond their intended callers. Keeping east-west traffic on an internal network reduces host configuration and clarifies the contract. Network isolation is not application authorization, but it is a useful layer that prevents accidental reachability.`,
      decision: `Start with the default Compose network for a small stack. Address dependencies by service name, never by a container's current IP. Publish only user-facing or host-debug endpoints, and bind development ports to \`127.0.0.1\` when remote access is unnecessary. Add separate frontend and backend networks when the topology conveys a real policy—for example, a proxy can reach the API, the API can reach the database, and the proxy cannot reach the database. Keep protocols and port numbers explicit at each hop.`,
      model: `A Compose network provides an isolated bridge and DNS records for attached services. A service can have multiple container replicas, so DNS may resolve to changing addresses; clients should reconnect and resolve names rather than cache one IP forever. \`expose\` documents container ports for readers but does not create a security firewall. \`ports\` installs host-to-container publishing, expressed as host address, host port, and container port.

A server must listen on an address reachable inside its namespace. Binding only to \`127.0.0.1\` inside a container prevents peers and published forwarding from reaching it; most containerized servers listen on \`0.0.0.0\` or the container interface. Clients inside the stack still use the container port even if the host port differs. DNS readiness and process readiness are separate: a name can resolve before the service accepts connections.`,
      invariants: [
        'Localhost always refers to the current network namespace.',
        'Service names are stable discovery inputs; container IP addresses are runtime details.',
        'Container-to-container clients use container ports, not host-published ports.',
        'Publishing creates reachability but does not provide authentication, encryption, or application authorization.',
      ],
      walkthrough: `The API and database share a private backend network. A small proxy shares the frontend network with the API and is the only service published to the host. The database has no host port. The API image contains a simple server and runs as a non-root user. This topology demonstrates routing intent without depending on fixed IP addresses or container names.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js ./
ENV HOST=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  proxy:
    image: nginx:1.27.3-alpine
    ports:
      - "127.0.0.1:8080:80"
    networks: [frontend]
  api:
    build: .
    environment:
      DATABASE_HOST: db
      DATABASE_PORT: "5432"
    networks: [frontend, backend]
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_PASSWORD: local-only
    networks: [backend]
networks:
  frontend:
  backend:
    internal: true
`,
      steps: [
        'Render config, start the stack, and inspect each service network attachment without relying on generated container names.',
        'From `api`, resolve `db` and connect to port 5432; explain why no database host port is required.',
        'From `proxy`, attempt to resolve `db` and verify backend segmentation prevents direct discovery.',
        'Request the proxy through host port 8080 and trace host port, proxy port, service name, and API container port.',
        'Temporarily bind the API server to `127.0.0.1` inside its container and diagnose the resulting peer connection failure.',
        'Scale the API to two replicas and observe service discovery while avoiding fixed `container_name` and host-port collisions.',
      ],
      review: `Use a hop-by-hop worksheet during incidents: source namespace, destination name, DNS result, protocol, destination port, server listen address, and policy between them. Test from the source container because a successful host curl proves a different path. Minimal runtime images may not contain diagnostics; use a disposable toolbox container attached to the same network instead of permanently adding scanners and shells to every application image.`,
      pitfalls: [
        'Using `localhost` for a database dependency points the API back at itself.',
        'Using the published host port from another container adds an unnecessary host hairpin and often fails across environments.',
        'Setting `container_name` prevents straightforward scaling and couples scripts to an implementation detail.',
        'Assuming `depends_on` or DNS availability means the service is ready causes startup races.',
        'Publishing a database on all host interfaces for convenience can expose it to a LAN or cloud network.',
      ],
      tradeoff: `Extra networks communicate intent and reduce accidental reachability, but dozens of micro-segments in a local stack add configuration without replacing service authentication. Use the fewest networks that express real caller groups. TLS may terminate at a proxy in a trusted local environment, while zero-trust or cross-host traffic may require end-to-end encryption. Docker bridge isolation addresses topology; identity and authorization remain application or platform concerns.`,
      exercises: [
        {
          name: 'Trace a request',
          task: 'Draw and validate every address and port used from a host curl through proxy to API and from API to database.',
          done: 'Include commands run from each namespace and identify where DNS and port translation occur.',
        },
        {
          name: 'Diagnose four failures',
          task: 'Introduce a wrong service name, wrong container port, loopback-only bind, and missing network attachment one at a time.',
          done: 'For each failure, record symptom, discriminating command, root cause, and minimal fix.',
        },
        {
          name: 'Reduce exposure',
          task: 'Audit a Compose stack that publishes every service and remove ports not needed by host clients.',
          done: 'Show host reachability before and after while proving internal service communication still works.',
        },
      ],
    },
    vn: {
      title: 'Networking',
      baseline: [
        'Hiểu IP address, TCP port, DNS và localhost',
        'Dùng được curl hoặc database client để kiểm tra service',
        'Biết listening và publishing là hai operation khác nhau',
      ],
      skills: [
        'Dùng Compose service discovery và container port đúng',
        'Giới hạn host exposure và chia traffic bằng network theo mục đích',
        'Chẩn đoán lỗi name resolution, bind address, protocol và port mapping',
      ],
      why: `Container networking đơn giản khi xem mỗi network namespace như một góc nhìn mạng riêng giống một máy. Trong API container, \`localhost\` là chính API container, không phải database container hay laptop. Service trên Compose network chung gọi nhau bằng service name và container port. Chỉ cần publish host port khi traffic phải đi từ host hoặc external client vào network đó.

Khác biệt này liên quan cả vận hành lẫn bảo mật. Publish mọi port database, cache và broker làm tăng collision và phơi service ngoài caller dự kiến. Giữ east-west traffic trên internal network giảm host configuration và làm contract rõ. Network isolation không phải application authorization, nhưng là lớp hữu ích ngăn reachability vô tình.`,
      decision: `Bắt đầu với default Compose network cho stack nhỏ. Gọi dependency bằng service name, không dùng IP hiện tại của container. Chỉ publish user-facing hoặc host-debug endpoint, bind development port vào \`127.0.0.1\` khi không cần remote access. Thêm frontend/backend network riêng khi topology thể hiện policy thật: proxy gọi API, API gọi database, proxy không gọi database. Giữ protocol và port rõ ở mỗi hop.`,
      model: `Compose network cung cấp isolated bridge và DNS record cho service attached. Service có thể có nhiều replica nên DNS có thể trả địa chỉ thay đổi; client cần reconnect và resolve name thay vì cache một IP mãi. \`expose\` tài liệu hóa container port nhưng không tạo firewall bảo mật. \`ports\` cài host-to-container publishing theo host address, host port và container port.

Server phải listen trên address reachable trong namespace. Bind chỉ \`127.0.0.1\` trong container ngăn peer và published forwarding truy cập; đa số container server listen \`0.0.0.0\` hoặc container interface. Client trong stack vẫn dùng container port dù host port khác. DNS readiness và process readiness riêng biệt: name có thể resolve trước khi service nhận connection.`,
      invariants: [
        'Localhost luôn chỉ network namespace hiện tại.',
        'Service name là discovery input ổn định; container IP là runtime detail.',
        'Client container-to-container dùng container port, không dùng host-published port.',
        'Publishing tạo reachability nhưng không cung cấp authentication, encryption hay application authorization.',
      ],
      walkthrough: `API và database chia sẻ private backend network. Proxy nhỏ chia sẻ frontend network với API và là service duy nhất publish lên host. Database không có host port. API image chứa server đơn giản và chạy non-root. Topology thể hiện routing intent mà không phụ thuộc fixed IP hay container name.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js ./
ENV HOST=0.0.0.0 PORT=3000
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  proxy:
    image: nginx:1.27.3-alpine
    ports:
      - "127.0.0.1:8080:80"
    networks: [frontend]
  api:
    build: .
    environment:
      DATABASE_HOST: db
      DATABASE_PORT: "5432"
    networks: [frontend, backend]
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_PASSWORD: local-only
    networks: [backend]
networks:
  frontend:
  backend:
    internal: true
`,
      steps: [
        'Render config, start stack và inspect network attachment của từng service mà không dựa generated container name.',
        'Từ `api`, resolve `db` và connect port 5432; giải thích vì sao không cần database host port.',
        'Từ `proxy`, thử resolve `db` và xác minh backend segmentation ngăn direct discovery.',
        'Request proxy qua host port 8080, trace host port, proxy port, service name và API container port.',
        'Tạm bind API server vào `127.0.0.1` trong container và chẩn đoán peer connection failure.',
        'Scale API thành hai replica, quan sát service discovery, tránh fixed `container_name` và host-port collision.',
      ],
      review: `Dùng worksheet từng hop khi có incident: source namespace, destination name, DNS result, protocol, destination port, server listen address và policy giữa chúng. Test từ source container vì host curl thành công chứng minh một path khác. Minimal image có thể không có diagnostic; dùng disposable toolbox container gắn cùng network thay vì thêm scanner và shell lâu dài vào mọi app image.`,
      pitfalls: [
        'Dùng `localhost` cho database dependency trỏ API về chính nó.',
        'Dùng published host port từ container khác tạo host hairpin không cần thiết và thường fail giữa môi trường.',
        'Đặt `container_name` ngăn scale đơn giản và ghép script vào implementation detail.',
        'Giả định `depends_on` hoặc DNS availability nghĩa là service ready gây startup race.',
        'Publish database trên mọi host interface cho tiện có thể phơi nó ra LAN hoặc cloud network.',
      ],
      tradeoff: `Network bổ sung truyền intent và giảm accidental reachability, nhưng hàng chục micro-segment trong local stack thêm config mà không thay service authentication. Dùng ít network nhất vẫn thể hiện caller group thật. TLS có thể terminate ở proxy trong local trusted environment, còn zero-trust hoặc cross-host traffic có thể cần end-to-end encryption. Docker bridge isolation xử lý topology; identity và authorization vẫn là concern của app hoặc platform.`,
      exercises: [
        {
          name: 'Trace một request',
          task: 'Vẽ và xác minh mọi address, port từ host curl qua proxy tới API và từ API tới database.',
          done: 'Có command chạy từ mỗi namespace và chỉ nơi DNS cùng port translation xảy ra.',
        },
        {
          name: 'Chẩn đoán bốn lỗi',
          task: 'Lần lượt đưa vào wrong service name, wrong container port, loopback-only bind và missing network attachment.',
          done: 'Với mỗi lỗi, ghi symptom, command phân biệt, root cause và minimal fix.',
        },
        {
          name: 'Giảm exposure',
          task: 'Audit Compose stack publish mọi service và bỏ port host client không cần.',
          done: 'Cho host reachability trước/sau và chứng minh internal communication vẫn chạy.',
        },
      ],
    },
  }),
  makeSection({
    id: 'compose-local-stacks',
    en: {
      title: 'Compose for local stacks',
      baseline: [
        'Can run images and read YAML',
        'Understands service dependencies and local development workflows',
        'Can distinguish declarative configuration from imperative setup',
      ],
      skills: [
        'Model a reproducible multi-service local stack with Compose',
        'Use profiles, overrides, and one-off jobs without duplicating the core contract',
        'Operate the stack through render, build, start, inspect, logs, run, and teardown',
      ],
      why: `Compose gives a team one declarative description of the containers, networks, volumes, health conditions, and runtime settings needed to exercise a local system. Its value is not saving keystrokes; it is replacing tribal startup order and hidden workstation services with a reviewable contract. A new engineer should be able to clone the repository, provide documented local inputs, run a small set of commands, and reach the same service topology.

Compose is also a boundary. It is excellent for local development, integration tests, examples, and single-host workflows. It does not automatically provide multi-host scheduling, rolling deployments, durable control planes, or production secret management. Keeping the file focused on the application contract makes it portable without pretending local orchestration is the production platform.`,
      decision: `Put stable service definitions in \`compose.yaml\`. Use a small override file only for development-specific source mounts or debug commands. Use profiles for optional tools such as admin UIs and migration runners. Prefer service names, named volumes, and health-aware dependencies. Avoid fixed container names and unnecessary host ports. If CI uses the stack, render the merged config there and choose a unique project name to isolate parallel runs.`,
      model: `A Compose project is a set of labeled resources derived from the project name and resolved model. \`docker compose config\` renders that model after file merges, environment interpolation, defaults, and profile selection. \`up\` reconciles containers toward the model; changed images or config may recreate containers. \`run\` starts a one-off container from a service definition, while \`exec\` runs inside an existing service container. These are different lifecycle operations.

\`depends_on\` expresses startup and shutdown relationships, not arbitrary application workflow. With a health condition it can delay a dependent start until a dependency reports healthy, but clients still need retries because dependencies can fail later. Compose resource names and labels support cleanup; ad hoc \`docker run\` commands outside the project are invisible to that lifecycle.`,
      invariants: [
        'The rendered Compose model is the configuration to review, not any single source YAML file in isolation.',
        'Service dependencies organize startup but do not replace resilient client behavior.',
        'One-off jobs should reuse service networks and configuration while keeping their own finite command.',
        'Project names isolate resource names, enabling concurrent stacks when host ports do not collide.',
      ],
      walkthrough: `The stack contains an API, PostgreSQL, and a finite migration job. The database healthcheck gates the migration; successful migration gates API startup. An optional Adminer UI lives behind a tools profile. The API Dockerfile builds a small production-like image rather than bind-mounting the entire host tree, so integration behavior exercises the artifact that CI could publish.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js migrate.js ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-only
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 2s
      timeout: 2s
      retries: 15
    volumes: [db-data:/var/lib/postgresql/data]
  migrate:
    build: .
    command: ["node", "migrate.js"]
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    depends_on:
      db:
        condition: service_healthy
  api:
    build: .
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    ports: ["127.0.0.1:3000:3000"]
    depends_on:
      migrate:
        condition: service_completed_successfully
  admin:
    image: adminer:4.8.1
    profiles: ["tools"]
    ports: ["127.0.0.1:8080:8080"]
volumes:
  db-data:
`,
      steps: [
        'Run `docker compose config` without and with the tools profile; review the exact resolved services and values.',
        'Build, start, and watch `docker compose ps --all` until database health, migration completion, and API startup are visible.',
        'Use `docker compose logs --since=5m api db migrate` and correlate events instead of opening separate terminals blindly.',
        'Run a finite administrative command with `docker compose run --rm api ...` and compare its lifecycle with `exec`.',
        'Start a second project with `-p` and a different host-port override; verify networks and volumes remain isolated.',
        'Use `down --remove-orphans` for containers and network, deciding explicitly whether the persistent volume should remain.',
      ],
      review: `A useful local stack has a documented happy path and a documented reset path. It should fail with understandable logs when configuration is missing, not silently fall back to a developer's machine service. Keep sample data and migrations deterministic. If source mounts are added for hot reload, test the built-image path separately because mounts can hide packaging defects. Render configuration in review whenever multiple files or environment interpolation are used.`,
      pitfalls: [
        'Putting every optional tool in the default profile consumes resources and enlarges the failure surface for all developers.',
        'Using `sleep 10` as dependency readiness turns machine speed into an undeclared requirement.',
        'Running migrations independently from image versions can leave schema and application contracts out of sync.',
        'Using global fixed volume or container names causes unrelated projects and CI jobs to collide.',
        'Treating `restart: always` as error handling can hide a deterministic crash loop and flood logs.',
      ],
      tradeoff: `A single Compose file is easy to understand until environment-specific conditionals accumulate. Prefer one stable base plus a narrow development override or profile, and inspect the merged result. Duplicating an entire production deployment manifest for local use creates drift; forcing every production mechanism into local development creates friction. Share service contracts and artifact names, while letting each platform express scheduling, credentials, and infrastructure in its native form.`,
      exercises: [
        {
          name: 'Cold-start contract',
          task: 'Clone or copy the project into a clean directory, remove project resources, and bring the stack up using only documented inputs.',
          done: 'Provide commands, time to healthy state, application check, and complete teardown result.',
        },
        {
          name: 'Add a finite job',
          task: 'Add a seed service that waits for migration, exits zero when complete, and is safe to run twice.',
          done: 'Show first and second runs, database evidence, and an API start that depends on successful completion.',
        },
        {
          name: 'Parallel projects',
          task: 'Run two isolated project instances with distinct project names and host ports.',
          done: 'List both networks, volumes, and containers, then delete one without affecting the other.',
        },
      ],
    },
    vn: {
      title: 'Compose cho local stack',
      baseline: [
        'Chạy được image và đọc YAML',
        'Hiểu service dependency và local development workflow',
        'Phân biệt declarative configuration với imperative setup',
      ],
      skills: [
        'Mô hình hóa multi-service local stack tái lập được bằng Compose',
        'Dùng profile, override và one-off job mà không duplicate core contract',
        'Vận hành stack qua render, build, start, inspect, logs, run và teardown',
      ],
      why: `Compose cho đội ngũ một mô tả khai báo về container, network, volume, health condition và runtime setting để chạy local system. Giá trị không phải giảm vài phím gõ; nó thay startup order truyền miệng và workstation service ẩn bằng contract review được. Kỹ sư mới cần clone repository, cung cấp local input đã ghi, chạy một tập command nhỏ và đạt cùng service topology.

Compose cũng là một ranh giới. Nó tốt cho local development, integration test, example và single-host workflow. Nó không tự động cung cấp multi-host scheduling, rolling deployment, durable control plane hay production secret management. Giữ file tập trung vào application contract làm nó portable mà không giả vờ local orchestration là production platform.`,
      decision: `Đặt stable service definition trong \`compose.yaml\`. Chỉ dùng override file nhỏ cho source mount hoặc debug command riêng development. Dùng profile cho tool tùy chọn như admin UI và migration runner. Ưu tiên service name, named volume và health-aware dependency. Tránh fixed container name và host port không cần. Nếu CI dùng stack, render merged config ở đó và chọn project name duy nhất để cô lập parallel run.`,
      model: `Compose project là tập resource có label được suy ra từ project name và resolved model. \`docker compose config\` render model sau merge file, environment interpolation, default và profile selection. \`up\` reconcile container theo model; image hoặc config đổi có thể recreate. \`run\` start one-off container từ service definition, còn \`exec\` chạy trong service container đang có. Đây là operation vòng đời khác nhau.

\`depends_on\` thể hiện quan hệ startup/shutdown, không phải workflow ứng dụng tùy ý. Với health condition nó có thể trì hoãn dependent tới khi dependency healthy, nhưng client vẫn cần retry vì dependency có thể fail về sau. Compose resource name và label hỗ trợ cleanup; lệnh \`docker run\` ad hoc ngoài project không thuộc lifecycle đó.`,
      invariants: [
        'Rendered Compose model là configuration cần review, không phải một source YAML riêng lẻ.',
        'Service dependency tổ chức startup nhưng không thay resilient client behavior.',
        'One-off job nên tái dùng service network và config nhưng có finite command riêng.',
        'Project name cô lập resource name, cho phép concurrent stack khi host port không collision.',
      ],
      walkthrough: `Stack gồm API, PostgreSQL và finite migration job. Database healthcheck gate migration; migration thành công gate API startup. Adminer UI tùy chọn nằm sau tools profile. API Dockerfile build image nhỏ giống production thay vì bind mount cả host tree, để integration behavior kiểm tra artifact CI có thể publish.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js migrate.js ./
USER node
EXPOSE 3000
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: local-only
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 2s
      timeout: 2s
      retries: 15
    volumes: [db-data:/var/lib/postgresql/data]
  migrate:
    build: .
    command: ["node", "migrate.js"]
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    depends_on:
      db:
        condition: service_healthy
  api:
    build: .
    environment:
      DATABASE_URL: postgres://app:local-only@db:5432/app
    ports: ["127.0.0.1:3000:3000"]
    depends_on:
      migrate:
        condition: service_completed_successfully
  admin:
    image: adminer:4.8.1
    profiles: ["tools"]
    ports: ["127.0.0.1:8080:8080"]
volumes:
  db-data:
`,
      steps: [
        'Chạy `docker compose config` không và có tools profile; review service cùng value đã resolve chính xác.',
        'Build, start và xem `docker compose ps --all` tới khi database health, migration completion và API startup rõ.',
        'Dùng `docker compose logs --since=5m api db migrate` để correlate event thay vì mở terminal riêng mù quáng.',
        'Chạy finite administrative command bằng `docker compose run --rm api ...` và so lifecycle với `exec`.',
        'Start project thứ hai với `-p` và host-port override khác; xác minh network cùng volume cô lập.',
        'Dùng `down --remove-orphans` cho container/network và quyết định rõ persistent volume có giữ không.',
      ],
      review: `Local stack hữu ích có happy path và reset path được ghi. Nó phải fail với log dễ hiểu khi thiếu config, không âm thầm fallback sang service trên máy developer. Giữ sample data và migration deterministic. Nếu thêm source mount cho hot reload, test built-image path riêng vì mount có thể che packaging defect. Render config khi review nếu dùng nhiều file hoặc environment interpolation.`,
      pitfalls: [
        'Đặt mọi optional tool trong default profile tốn resource và tăng failure surface cho tất cả developer.',
        'Dùng `sleep 10` làm dependency readiness biến tốc độ máy thành yêu cầu ẩn.',
        'Chạy migration độc lập với image version có thể làm schema và application contract lệch.',
        'Dùng global fixed volume hoặc container name gây collision giữa project và CI job.',
        'Xem `restart: always` là error handling có thể che deterministic crash loop và flood log.',
      ],
      tradeoff: `Một Compose file dễ hiểu tới khi environment-specific conditional tích tụ. Ưu tiên một base ổn định cộng development override hoặc profile hẹp, rồi inspect merged result. Duplicate toàn production deployment manifest cho local tạo drift; ép mọi production mechanism vào local tạo friction. Chia sẻ service contract và artifact name, còn scheduling, credential và infrastructure để mỗi platform diễn đạt native.`,
      exercises: [
        {
          name: 'Cold-start contract',
          task: 'Clone/copy project vào clean directory, xóa project resource và bring up chỉ bằng input đã document.',
          done: 'Có command, thời gian tới healthy, application check và teardown result hoàn chỉnh.',
        },
        {
          name: 'Thêm finite job',
          task: 'Thêm seed service chờ migration, exit zero khi xong và an toàn khi chạy hai lần.',
          done: 'Cho first/second run, database evidence và API start phụ thuộc completion thành công.',
        },
        {
          name: 'Project song song',
          task: 'Chạy hai project instance cô lập với project name và host port khác.',
          done: 'Liệt kê network, volume, container của cả hai rồi xóa một mà không ảnh hưởng bên kia.',
        },
      ],
    },
  }),
  makeSection({
    id: 'env-secrets-config',
    en: {
      title: 'Env, secrets, config',
      baseline: [
        'Understands runtime configuration and process environments',
        'Knows why credentials must not be committed to source control',
        'Can define required configuration and validate it at startup',
      ],
      skills: [
        'Separate build inputs, non-secret configuration, and secret material',
        'Use Compose environment, env files, configs, and secret files intentionally',
        'Design startup validation, redaction, rotation, and least-privilege access',
      ],
      why: `A reusable image should represent one artifact that can be promoted across environments. Rebuilding the image to change a database host, feature flag, or log level ties configuration to artifact creation and makes provenance harder to reason about. Runtime configuration preserves promotion: the same digest can be tested, staged, and deployed with environment-specific values supplied externally.

Secrets require stricter handling than ordinary configuration. Environment variables are convenient and widely supported, but they can appear in process inspection, crash reports, support bundles, debug endpoints, and accidental logs. Build arguments and image environment metadata are worse places for durable credentials because they cross the build boundary. Secret files with restricted access, short-lived identity credentials, and external secret managers reduce exposure, but the application must support reading and rotating them.`,
      decision: `Classify every value by sensitivity, lifetime, and consumer. Public defaults such as log format can live in the image. Environment-specific non-secret settings can use environment variables or config files. Credentials should be injected at runtime through a secret mechanism and exposed only to the service that needs them. Build credentials should use BuildKit secret mounts and disappear after the instruction. Define precedence explicitly and fail startup on missing, malformed, or contradictory required values.`,
      model: `Dockerfile \`ENV\` becomes image metadata and a runtime default. Compose \`environment\` sets values on the created container. \`env_file\` supplies container environment entries; the CLI's project \`.env\` primarily participates in Compose interpolation and is not automatically the same thing. Shell environment and Compose precedence can override file values, so \`docker compose config\` is essential for non-secret review—but rendering secret values into logs is itself a risk.

Compose secrets are mounted as files under \`/run/secrets\` for local Compose. They improve scope and avoid ordinary environment propagation, though local implementations do not magically provide enterprise vaulting or rotation. Config files can be mounted read-only. Applications should accept a clear \`*_FILE\` option or direct file path, read only when needed, avoid logging values, and distinguish unavailable configuration from unavailable dependencies.`,
      invariants: [
        'Changing runtime configuration should not require changing the image digest.',
        'Anything copied into an image or emitted in build logs must be treated as potentially distributable.',
        'A secret should be available only to the smallest set of services, for the shortest practical lifetime.',
        'Configuration names, types, defaults, required status, and precedence form a versioned application contract.',
      ],
      walkthrough: `The API reads non-secret settings from environment and a database password from a mounted secret file. PostgreSQL uses its supported \`POSTGRES_PASSWORD_FILE\` convention. The image copies no environment file. Compose demonstrates a local secret source path that should be ignored by version control; a committed \`.env.example\` may list names and safe sample values, never real credentials.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js config.js ./
ENV NODE_ENV=production LOG_LEVEL=info
USER node
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build: .
    environment:
      DATABASE_HOST: db
      DATABASE_USER: app
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
      LOG_LEVEL: "\${LOG_LEVEL:-debug}"
    secrets: [db-password]
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
secrets:
  db-password:
    file: ./secrets/db-password.txt
`,
      steps: [
        'Add `secrets/` and real environment files to `.gitignore`, then commit only a documented example of required names.',
        'Run `docker compose config --environment` for interpolation inputs and review precedence without sharing sensitive output.',
        'Start with the secret file absent and verify the failure is immediate, specific, and does not print a credential.',
        'Create the local secret with restrictive host permissions, start the stack, and inspect which services receive the mount.',
        'Inspect image history and config to prove the password was not placed in a layer, ARG, or ENV.',
        'Rotate the local value by changing the source and recreating affected containers; document whether the application rereads or requires restart.',
      ],
      review: `Configuration code should parse once, validate types and ranges, and expose a typed object to the rest of the application. It should not scatter environment reads throughout business logic. Redact connection strings because passwords may be embedded in URLs. Avoid dumping the complete environment in startup logs. In production, prefer workload identity or a managed secret provider when available, and audit both access to the secret and permission to change the workload that consumes it.`,
      pitfalls: [
        'Committing `.env` because the repository is private ignores forks, logs, backups, compromised accounts, and future visibility changes.',
        'Passing a token through Dockerfile ARG keeps it out of final ENV but can still expose it through history, provenance, or build commands.',
        'Assuming unset and empty mean the same thing can disable validation or authentication unexpectedly.',
        'Using one shared database password for every service destroys least privilege and complicates rotation.',
        'Logging the rendered Compose model or full process environment in CI can move secrets into long-lived logs.',
      ],
      tradeoff: `Environment variables are portable and ergonomic for small scalar settings, but poor for structured configuration, large certificates, and values that rotate without restart. Mounted files support those cases but require file watching, permissions, and atomic update semantics. External secret managers improve issuance and auditing while adding availability and integration dependencies. Choose the least complex mechanism that meets exposure, rotation, and audit requirements, then document the operational behavior.`,
      exercises: [
        {
          name: 'Configuration contract',
          task: 'Write a table for every setting with type, default, required status, sensitivity, source, precedence, and restart behavior.',
          done: 'Make the application reject three malformed cases with redacted, actionable errors.',
        },
        {
          name: 'Leak audit',
          task: 'Search image history, inspect output, repository files, build logs, and application logs for a unique fake credential.',
          done: 'Show that the value appears only in the intended runtime secret file and document every checked surface.',
        },
        {
          name: 'Rotation drill',
          task: 'Change a database credential, update consumers in a safe order, and restore service without rebuilding images.',
          done: 'Record the sequence, outage behavior, rollback path, and evidence that the old credential no longer works.',
        },
      ],
    },
    vn: {
      title: 'Biến môi trường, secret và config',
      baseline: [
        'Hiểu runtime configuration và process environment',
        'Biết vì sao credential không được commit vào source control',
        'Định nghĩa và validate required configuration lúc startup',
      ],
      skills: [
        'Tách build input, non-secret configuration và secret material',
        'Dùng Compose environment, env file, config và secret file có chủ ý',
        'Thiết kế startup validation, redaction, rotation và least-privilege access',
      ],
      why: `Image tái sử dụng cần đại diện một artifact có thể promote qua môi trường. Rebuild image để đổi database host, feature flag hoặc log level ghép configuration vào artifact creation và làm provenance khó suy luận. Runtime configuration giữ promotion: cùng digest được test, stage và deploy với giá trị riêng môi trường cung cấp ngoài.

Secret cần xử lý chặt hơn config thường. Environment variable tiện và phổ biến nhưng có thể xuất hiện trong process inspection, crash report, support bundle, debug endpoint và log vô tình. Build argument và image environment metadata còn tệ hơn cho credential lâu dài vì vượt build boundary. Secret file có access hạn chế, identity credential ngắn hạn và external secret manager giảm exposure, nhưng app phải hỗ trợ đọc và rotate.`,
      decision: `Phân loại mỗi giá trị theo sensitivity, lifetime và consumer. Public default như log format có thể ở image. Non-secret setting theo môi trường dùng environment variable hoặc config file. Credential phải inject runtime qua secret mechanism và chỉ expose cho service cần. Build credential dùng BuildKit secret mount rồi biến mất sau instruction. Định nghĩa precedence rõ và fail startup khi required value thiếu, sai format hoặc mâu thuẫn.`,
      model: `Dockerfile \`ENV\` trở thành image metadata và runtime default. Compose \`environment\` đặt value trên container được tạo. \`env_file\` cấp container environment entry; project \`.env\` của CLI chủ yếu tham gia Compose interpolation và không tự động là cùng thứ. Shell environment và Compose precedence có thể override file, nên \`docker compose config\` cần cho non-secret review—nhưng render secret vào log cũng là rủi ro.

Compose secret được mount thành file dưới \`/run/secrets\` ở local Compose. Nó cải thiện scope và tránh environment propagation thông thường, dù local implementation không tự có enterprise vault hay rotation. Config file có thể mount read-only. App nên nhận \`*_FILE\` hoặc direct file path rõ, chỉ đọc khi cần, tránh log value và phân biệt missing config với unavailable dependency.`,
      invariants: [
        'Đổi runtime configuration không nên yêu cầu đổi image digest.',
        'Mọi thứ copy vào image hoặc emit trong build log phải được xem là có thể phân phối.',
        'Secret chỉ nên có cho tập service nhỏ nhất trong lifetime thực tế ngắn nhất.',
        'Tên, type, default, required status và precedence của config tạo versioned application contract.',
      ],
      walkthrough: `API đọc non-secret setting từ environment và database password từ mounted secret file. PostgreSQL dùng convention \`POSTGRES_PASSWORD_FILE\` được hỗ trợ. Image không copy environment file. Compose minh họa local secret source path phải ignore khỏi version control; \`.env.example\` commit được chỉ liệt kê name và sample an toàn, không có credential thật.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js config.js ./
ENV NODE_ENV=production LOG_LEVEL=info
USER node
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build: .
    environment:
      DATABASE_HOST: db
      DATABASE_USER: app
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
      LOG_LEVEL: "\${LOG_LEVEL:-debug}"
    secrets: [db-password]
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
secrets:
  db-password:
    file: ./secrets/db-password.txt
`,
      steps: [
        'Thêm `secrets/` và environment file thật vào `.gitignore`, chỉ commit example tên required với sample an toàn.',
        'Chạy `docker compose config --environment` cho interpolation input và review precedence mà không chia sẻ sensitive output.',
        'Start khi secret file không có, xác minh failure ngay, cụ thể và không in credential.',
        'Tạo local secret với restrictive host permission, start stack và inspect service nào nhận mount.',
        'Inspect image history/config để chứng minh password không nằm trong layer, ARG hoặc ENV.',
        'Rotate local value bằng cách đổi source và recreate container liên quan; ghi app reread hay cần restart.',
      ],
      review: `Configuration code nên parse một lần, validate type/range và expose typed object cho app. Không đọc environment rải trong business logic. Redact connection string vì password có thể nằm trong URL. Tránh dump toàn environment trong startup log. Ở production, ưu tiên workload identity hoặc managed secret provider khi có, audit cả access secret và quyền đổi workload tiêu thụ nó.`,
      pitfalls: [
        'Commit `.env` vì repository private bỏ qua fork, log, backup, compromised account và thay đổi visibility tương lai.',
        'Truyền token qua Dockerfile ARG giữ nó khỏi final ENV nhưng vẫn có thể lộ qua history, provenance hoặc build command.',
        'Giả định unset và empty giống nhau có thể vô tình tắt validation hay authentication.',
        'Dùng một shared database password cho mọi service phá least privilege và làm rotation khó.',
        'Log rendered Compose model hoặc full process environment trong CI có thể đưa secret vào log sống lâu.',
      ],
      tradeoff: `Environment variable portable và tiện cho scalar setting nhỏ nhưng kém cho structured config, certificate lớn và value rotate không restart. Mounted file hỗ trợ các case đó nhưng cần file watching, permission và atomic update semantics. External secret manager cải thiện issuance và audit nhưng thêm dependency availability/integration. Chọn cơ chế ít phức tạp nhất đáp ứng exposure, rotation và audit, rồi document operational behavior.`,
      exercises: [
        {
          name: 'Configuration contract',
          task: 'Viết bảng cho mọi setting với type, default, required, sensitivity, source, precedence và restart behavior.',
          done: 'Làm app reject ba case malformed với error actionable đã redact.',
        },
        {
          name: 'Leak audit',
          task: 'Tìm một fake credential duy nhất trong image history, inspect output, repository, build log và application log.',
          done: 'Cho thấy value chỉ xuất hiện ở runtime secret file dự kiến và ghi mọi surface đã kiểm.',
        },
        {
          name: 'Diễn tập rotation',
          task: 'Đổi database credential, update consumer theo thứ tự an toàn và phục hồi service không rebuild image.',
          done: 'Ghi sequence, outage behavior, rollback path và bằng chứng credential cũ không còn chạy.',
        },
      ],
    },
  }),
  makeSection({
    id: 'resources-healthchecks',
    en: {
      title: 'Resource limits & healthchecks',
      baseline: [
        'Understands CPU, memory, processes, signals, and HTTP status',
        'Can distinguish startup success from application readiness',
        'Has investigated a slow or repeatedly crashing service',
      ],
      skills: [
        'Set and observe CPU, memory, and process limits with realistic workloads',
        'Design healthchecks that represent useful service behavior',
        'Separate liveness, readiness, startup, dependency, and alerting concerns',
      ],
      why: `Without resource controls, one container can consume enough memory, CPU, or process slots to degrade neighboring workloads and the host. Limits make contention visible and create a failure boundary, but they do not choose correct capacity. A memory limit that is lower than the application's steady working set causes kills; a CPU limit can turn acceptable latency into timeouts; a process limit can break legitimate concurrency. Controls must be paired with measurement and load testing.

Healthchecks answer another bounded question: can a check run from the container's context and receive a useful response within a threshold? They help Compose and operators distinguish starting, healthy, and unhealthy states. They do not restart containers by themselves in every environment, route traffic in plain Docker, or replace monitoring. A shallow check can report healthy while all real requests fail; an expensive check can become load.`,
      decision: `Measure normal and peak behavior before selecting limits, then leave headroom for runtime overhead and bursts. Make application concurrency aware of CPU and memory constraints. Use a PID limit to contain runaway process creation. Design a fast, deterministic health endpoint that tests the service's critical internal ability without mutating state. Keep dependency checks deliberate: readiness may depend on a database, while liveness often should not kill an otherwise recoverable process during a database outage.`,
      model: `CPU limits control scheduling time, not a fixed processor speed. Under contention, throttling increases latency. Memory limits account for cgroup usage; when reclamation cannot keep usage below the hard limit, the kernel may kill a process, commonly yielding exit code 137. Reservations or soft hints are different from enforced ceilings and support varies by runtime mode. PID limits bound process creation, including threads on Linux.

Docker health status is separate from container running state. A command exits zero for success and nonzero for failure. \`interval\`, \`timeout\`, \`retries\`, and \`start_period\` define evaluation timing. The check runs inside the container, so it needs an available client and uses container-local addresses. Health output is retained in inspect data but should remain concise and free of secrets.`,
      invariants: [
        'A running process can be unhealthy, and an unhealthy container can remain running.',
        'A resource limit changes application behavior under pressure and must be included in performance tests.',
        'Health commands need tools actually present in the runtime image.',
        'A health endpoint should be bounded, side-effect free, and explicit about what it proves.',
      ],
      walkthrough: `The service includes an HTTP health endpoint and handles termination. BusyBox wget, already present in Alpine, performs the check without adding curl solely for health. Compose sets memory, CPU, and PID controls supported by local Compose and defines a startup allowance. A small load generator profile is optional so normal startup remains light. Production platforms may express equivalent controls differently, so validate the deployed specification separately.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js ./
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=2s --start-period=10s --retries=3 \
  CMD wget -q -T 1 -O /dev/null http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build: .
    ports: ["127.0.0.1:3000:3000"]
    init: true
    cpus: 0.75
    mem_limit: 256m
    pids_limit: 128
    healthcheck:
      test: ["CMD", "wget", "-q", "-T", "1", "-O", "/dev/null", "http://127.0.0.1:3000/health"]
      interval: 5s
      timeout: 2s
      start_period: 10s
      retries: 3
  load:
    image: grafana/k6:0.55.0
    profiles: ["load"]
    command: ["run", "/scripts/smoke.js"]
    volumes: ["./smoke.js:/scripts/smoke.js:ro"]
`,
      steps: [
        'Start the API and watch health transition with `docker compose ps` plus the detailed health log from `docker inspect`.',
        'Run `docker stats` during idle and representative load, recording CPU, memory, network, and process behavior.',
        'Lower memory below the measured working set, reproduce failure, and distinguish application exit from kernel OOM kill.',
        'Lower CPU and compare throughput and tail latency rather than looking only at average CPU percentage.',
        'Break only the health endpoint, observe Unhealthy while the process remains Up, and verify what Compose does not do automatically.',
        'Send SIGTERM under load and verify readiness changes, new work drains or stops, and exit occurs within the grace period.',
      ],
      review: `Review resource settings with application runtime settings. A JVM or Node process may size heaps and worker pools from visible CPU and memory; verify the exact runtime version behaves as expected in cgroups. Alert on sustained throttling, memory pressure, restart count, health failure, and user-visible latency rather than treating one metric as sufficient. Healthcheck timing also determines detection delay, so retries that avoid transient noise necessarily slow detection.`,
      pitfalls: [
        'Setting a memory limit from image size confuses disk content with runtime working memory.',
        'Using an expensive database query every few seconds can turn health monitoring into production load.',
        'Making liveness fail whenever any dependency fails can create a restart storm during a shared outage.',
        'Installing a large diagnostic package only for a one-line healthcheck increases runtime surface unnecessarily.',
        'Assuming local Compose resource syntax maps identically to every production scheduler can leave limits unenforced.',
      ],
      tradeoff: `A deep healthcheck proves more of the request path but couples health to dependencies and can amplify outages. A shallow process check is stable but may miss a broken service. Many platforms separate startup, liveness, and readiness probes because the correct failure action differs: wait during startup, restart deadlocked process, and stop routing to temporarily unready instances. Plain Docker offers a single health status, so document exactly how consumers interpret it.`,
      exercises: [
        {
          name: 'Capacity envelope',
          task: 'Load the service at increasing concurrency under two CPU and two memory limits.',
          done: 'Plot or tabulate throughput, p95 latency, throttling, memory, errors, and chosen headroom.',
        },
        {
          name: 'Probe design',
          task: 'Implement separate shallow and dependency-aware endpoints and define which one maps to each platform health concept.',
          done: 'Demonstrate process failure, database outage, slow startup, and recovery with expected statuses.',
        },
        {
          name: 'Failure evidence',
          task: 'Trigger OOM, CPU saturation, PID exhaustion, and health timeout safely in local containers.',
          done: 'For each case, identify the decisive inspect field, event, metric, log, or exit code.',
        },
      ],
    },
    vn: {
      title: 'Giới hạn tài nguyên và healthcheck',
      baseline: [
        'Hiểu CPU, memory, process, signal và HTTP status',
        'Phân biệt startup success với application readiness',
        'Đã điều tra service chậm hoặc crash lặp lại',
      ],
      skills: [
        'Đặt và quan sát CPU, memory, process limit với workload thực tế',
        'Thiết kế healthcheck đại diện hành vi service hữu ích',
        'Tách liveness, readiness, startup, dependency và alerting concern',
      ],
      why: `Không có resource control, một container có thể dùng đủ memory, CPU hoặc process slot để làm giảm chất lượng workload bên cạnh và host. Limit làm contention rõ và tạo failure boundary nhưng không tự chọn capacity đúng. Memory limit thấp hơn working set làm process bị kill; CPU limit biến latency chấp nhận được thành timeout; process limit có thể phá concurrency hợp lệ. Control phải đi cùng measurement và load test.

Healthcheck trả lời câu hỏi có giới hạn khác: check chạy từ context container có nhận response hữu ích trong threshold không? Nó giúp Compose và operator phân biệt starting, healthy, unhealthy. Nó không tự restart container trong mọi environment, không route traffic trong plain Docker và không thay monitoring. Check nông có thể báo healthy khi request thật fail; check đắt có thể trở thành load.`,
      decision: `Đo normal/peak behavior trước khi chọn limit, chừa headroom cho runtime overhead và burst. Làm application concurrency nhận biết CPU/memory constraint. Dùng PID limit để chứa runaway process creation. Thiết kế health endpoint nhanh, deterministic, test critical internal ability mà không mutate state. Chọn dependency check có chủ ý: readiness có thể phụ thuộc database, còn liveness thường không nên kill process có thể phục hồi trong database outage.`,
      model: `CPU limit kiểm soát scheduling time, không phải tốc độ processor cố định. Khi contention, throttling tăng latency. Memory limit account cgroup usage; khi reclamation không giữ dưới hard limit, kernel có thể kill process, thường exit code 137. Reservation hoặc soft hint khác enforced ceiling và support tùy runtime mode. PID limit chặn process creation, gồm thread trên Linux.

Docker health status tách khỏi container running state. Command exit zero là success, nonzero là failure. \`interval\`, \`timeout\`, \`retries\`, \`start_period\` định nghĩa timing. Check chạy trong container nên cần client có sẵn và dùng container-local address. Health output nằm trong inspect data nhưng cần ngắn và không có secret.`,
      invariants: [
        'Running process có thể unhealthy, và unhealthy container có thể vẫn running.',
        'Resource limit đổi behavior dưới pressure và phải nằm trong performance test.',
        'Health command cần tool thật sự có trong runtime image.',
        'Health endpoint cần bounded, side-effect free và nói rõ nó chứng minh gì.',
      ],
      walkthrough: `Service có HTTP health endpoint và xử lý termination. BusyBox wget đã có trong Alpine thực hiện check, không thêm curl chỉ vì health. Compose đặt memory, CPU, PID control được local Compose hỗ trợ và startup allowance. Load generator profile là tùy chọn để startup thường nhẹ. Production platform có thể diễn đạt control tương đương khác, nên validate deployed spec riêng.`,
      dockerfile: String.raw`
FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --chown=node:node server.js ./
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=2s --start-period=10s --retries=3 \
  CMD wget -q -T 1 -O /dev/null http://127.0.0.1:3000/health || exit 1
CMD ["node", "server.js"]
`,
      compose: String.raw`
services:
  api:
    build: .
    ports: ["127.0.0.1:3000:3000"]
    init: true
    cpus: 0.75
    mem_limit: 256m
    pids_limit: 128
    healthcheck:
      test: ["CMD", "wget", "-q", "-T", "1", "-O", "/dev/null", "http://127.0.0.1:3000/health"]
      interval: 5s
      timeout: 2s
      start_period: 10s
      retries: 3
  load:
    image: grafana/k6:0.55.0
    profiles: ["load"]
    command: ["run", "/scripts/smoke.js"]
    volumes: ["./smoke.js:/scripts/smoke.js:ro"]
`,
      steps: [
        'Start API và xem health transition bằng `docker compose ps` cùng detailed health log từ `docker inspect`.',
        'Chạy `docker stats` lúc idle và representative load, ghi CPU, memory, network và process behavior.',
        'Hạ memory dưới measured working set, tái hiện failure và phân biệt application exit với kernel OOM kill.',
        'Hạ CPU, so throughput và tail latency thay vì chỉ average CPU percentage.',
        'Chỉ làm hỏng health endpoint, quan sát Unhealthy trong khi process vẫn Up và xác minh Compose không tự làm gì.',
        'Gửi SIGTERM dưới load, xác minh readiness đổi, new work drain/stop và exit trong grace period.',
      ],
      review: `Review resource setting cùng application runtime setting. JVM hoặc Node có thể size heap và worker pool từ CPU/memory thấy được; xác minh runtime version cụ thể hoạt động đúng với cgroup. Alert sustained throttling, memory pressure, restart count, health failure và user-visible latency thay vì một metric. Health timing cũng quyết định detection delay nên retry tránh transient noise sẽ làm phát hiện chậm.`,
      pitfalls: [
        'Đặt memory limit theo image size nhầm disk content với runtime working memory.',
        'Dùng database query đắt mỗi vài giây biến health monitoring thành production load.',
        'Làm liveness fail mỗi khi dependency fail có thể tạo restart storm trong shared outage.',
        'Cài diagnostic package lớn chỉ cho healthcheck một dòng tăng runtime surface không cần.',
        'Giả định local Compose resource syntax map y hệt production scheduler có thể làm limit không enforce.',
      ],
      tradeoff: `Deep healthcheck chứng minh nhiều request path hơn nhưng ghép health vào dependency và có thể khuếch đại outage. Shallow process check ổn định nhưng bỏ lỡ broken service. Nhiều platform tách startup, liveness, readiness vì failure action khác: chờ startup, restart deadlock và ngừng route tới instance tạm unready. Plain Docker có một health status, nên document chính xác consumer diễn giải ra sao.`,
      exercises: [
        {
          name: 'Capacity envelope',
          task: 'Load service ở concurrency tăng dần dưới hai CPU và hai memory limit.',
          done: 'Plot hoặc lập bảng throughput, p95 latency, throttling, memory, error và headroom đã chọn.',
        },
        {
          name: 'Thiết kế probe',
          task: 'Implement shallow và dependency-aware endpoint, định nghĩa endpoint nào map với health concept từng platform.',
          done: 'Demo process failure, database outage, slow startup và recovery với status kỳ vọng.',
        },
        {
          name: 'Bằng chứng failure',
          task: 'Trigger OOM, CPU saturation, PID exhaustion và health timeout an toàn trong local container.',
          done: 'Với mỗi case, chỉ decisive inspect field, event, metric, log hoặc exit code.',
        },
      ],
    },
  }),
  makeSection({
    id: 'production-registries-security',
    en: {
      title: 'Production: registries, tags, security basics',
      baseline: [
        'Can build, tag, push, and pull an image in a development registry',
        'Understands software versions, hashes, identities, and least privilege',
        'Can read vulnerability and dependency reports critically',
      ],
      skills: [
        'Promote immutable image digests through environments with useful tags and provenance',
        'Reduce image, runtime, registry, and supply-chain attack surfaces',
        'Define scanning, signing, patching, rollback, and credential practices',
      ],
      why: `A registry is the distribution boundary between build and deployment. Production reliability depends on knowing exactly which bytes were built, tested, approved, and started. Tags are convenient names but generally mutable; a digest identifies manifest content. If an environment deploys only \`app:latest\`, rollback and incident reconstruction become guesses. A release should connect source revision, build record, image digest, dependency evidence, and deployment.

Security is layered. A small non-root image does not compensate for a leaked registry credential. A signed image does not make vulnerable application code safe. A clean scanner report does not prove absence of exploitable flaws. Useful controls reduce opportunities and improve evidence: trusted base sources, reproducible locked dependencies, minimal final images, vulnerability triage, signatures or attestations, least-privilege registry access, runtime restrictions, and timely rebuilds when bases change.`,
      decision: `Produce one image per source revision and promote its digest rather than rebuilding for each environment. Attach human-friendly immutable release tags and perhaps a moving channel tag, but record the resolved digest everywhere. Grant CI push access only to intended repositories and deployment identities pull access where possible. Pin bases deliberately, automate update review, scan both operating-system and application packages, and define severity plus exploitability policy with an exception process and expiry.`,
      model: `A registry stores blobs and manifests. Tags point to manifests; pushing the same tag can move that pointer. Pulling by digest requests immutable manifest content. Multi-platform tags may point to an index whose platform manifests have distinct digests, so record the digest relevant to the deployment and understand what a signature covers.

The attack surface spans build context, builder, dependencies, base image, CI credentials, registry, deployment configuration, runtime privileges, network, and host kernel. Rootless or non-root processes, dropped capabilities, read-only roots, seccomp/AppArmor, resource limits, and narrow networks reduce runtime power. Registry authentication controls who can read or write artifacts; authorization and short-lived credentials matter more than hiding registry URLs.`,
      invariants: [
        'A mutable tag is a lookup convenience, not immutable release identity.',
        'Promotion should preserve artifact bytes; environment configuration changes outside the image.',
        'Scanner findings require triage by package presence, runtime reachability, fix availability, and policy.',
        'Runtime hardening is defense in depth and does not remove the need to patch application and kernel vulnerabilities.',
      ],
      walkthrough: `The final image uses a pinned versioned base, non-root user, healthcheck, and a narrow artifact copy. Compose demonstrates a deployment-like contract using an image reference, read-only root, temporary writable space, dropped capabilities, no privilege escalation, resource controls, and local-only publishing. Replace the illustrative tag with an organization registry and deploy by digest in the real release pipeline.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm test && npm run build

FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  api:
    image: registry.example.com/team/api:1.8.0
    ports: ["127.0.0.1:3000:3000"]
    read_only: true
    tmpfs:
      - /tmp:size=32m,mode=1777
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true
    pids_limit: 128
    mem_limit: 256m
`,
      steps: [
        'Build with source revision and version labels, tag the resulting image with a unique release version, and capture its local digest.',
        'Authenticate to a test registry through credential input that does not appear on the command line or in shell history.',
        'Push once, inspect the remote manifest, and record the immutable digest returned by the registry.',
        'Pull and run by digest in a clean environment, then prove the application and health contract.',
        'Generate an SBOM and scan the image; triage findings against actual runtime content and available fixes.',
        'Attempt writes, privilege gain, and disallowed operations under the hardened Compose settings; document required exceptions rather than removing all controls.',
      ],
      review: `A production checklist should be evidence-driven. Record builder identity, source revision, dependency locks, base digest, image digest, test result, SBOM, scan result, signature or attestation, and approver policy. Protect deletion and tag mutation in the registry. Define retention without deleting artifacts still needed for rollback or investigation. Rebuild even unchanged application source when a patched base or dependency becomes available, producing a new digest and repeating validation.`,
      pitfalls: [
        'Deploying the same moving tag to multiple environments makes observed differences impossible to attribute confidently.',
        'Pinning a digest forever without an update process trades surprise upgrades for silent vulnerability stagnation.',
        'Treating every scanner finding as equally exploitable creates alert fatigue; ignoring unfixed findings creates unmanaged risk.',
        'Running as a numeric non-root user while granting broad capabilities or host mounts can still expose powerful access.',
        'Using long-lived shared registry credentials in developer machines and CI prevents attribution and increases blast radius.',
      ],
      tradeoff: `Digest pinning gives immutable identity but needs automation to surface updates. Version tags improve human navigation but need immutability policy. Distroless images reduce shell and package-manager surface but can complicate certificates, native dependencies, and incident inspection; ephemeral debug containers may provide a better path. Signing improves provenance decisions only when verifiers enforce trusted identities and policies. Each control needs an owner and a failure mode, not merely a checkbox.`,
      exercises: [
        {
          name: 'Promotion record',
          task: 'Build once and promote the same digest through mock development, staging, and production records with different runtime config.',
          done: 'Show identical digest, distinct config, release metadata, and a rollback to the previous digest.',
        },
        {
          name: 'Threat-model the path',
          task: 'Map trust boundaries from developer context through CI, registry, deployment identity, runtime, and host.',
          done: 'For each boundary list credential, write authority, tampering signal, preventive control, and recovery action.',
        },
        {
          name: 'Harden and justify',
          task: 'Apply non-root, read-only root, tmpfs, capability drops, no-new-privileges, limits, and narrow mounts.',
          done: 'Run functional checks and document each exception with the exact operation that requires it.',
        },
      ],
    },
    vn: {
      title: 'Production: registry, tag và bảo mật cơ bản',
      baseline: [
        'Build, tag, push và pull được image trong development registry',
        'Hiểu software version, hash, identity và least privilege',
        'Đọc vulnerability và dependency report có phê phán',
      ],
      skills: [
        'Promote immutable image digest qua môi trường với tag và provenance hữu ích',
        'Giảm attack surface của image, runtime, registry và supply chain',
        'Định nghĩa scanning, signing, patching, rollback và credential practice',
      ],
      why: `Registry là distribution boundary giữa build và deployment. Độ tin cậy production phụ thuộc biết chính xác byte nào được build, test, approve và start. Tag là tên tiện nhưng thường mutable; digest định danh manifest content. Nếu môi trường chỉ deploy \`app:latest\`, rollback và incident reconstruction trở thành đoán. Release cần nối source revision, build record, image digest, dependency evidence và deployment.

Bảo mật có nhiều lớp. Image nhỏ non-root không bù cho registry credential bị leak. Signed image không làm application code có vulnerability trở nên an toàn. Scanner report sạch không chứng minh không có exploitable flaw. Control hữu ích giảm cơ hội và tăng evidence: trusted base, locked dependency tái lập, minimal final image, vulnerability triage, signature/attestation, least-privilege registry access, runtime restriction và rebuild kịp khi base đổi.`,
      decision: `Tạo một image cho mỗi source revision và promote digest thay vì rebuild theo môi trường. Gắn immutable release tag dễ đọc và có thể moving channel tag, nhưng ghi resolved digest mọi nơi. Chỉ cấp CI push vào repository dự kiến và deployment identity pull khi có thể. Pin base có chủ ý, tự động hóa update review, scan OS lẫn application package và định policy severity cộng exploitability với exception có hạn sử dụng.`,
      model: `Registry lưu blob và manifest. Tag trỏ tới manifest; push cùng tag có thể di chuyển pointer. Pull bằng digest yêu cầu manifest content bất biến. Multi-platform tag có thể trỏ index với platform manifest có digest riêng, nên ghi digest liên quan deployment và hiểu signature cover gì.

Attack surface trải từ build context, builder, dependency, base image, CI credential, registry, deployment config, runtime privilege, network tới host kernel. Rootless/non-root process, dropped capability, read-only root, seccomp/AppArmor, resource limit và narrow network giảm runtime power. Registry authentication kiểm soát ai đọc/ghi artifact; authorization và credential ngắn hạn quan trọng hơn giấu URL registry.`,
      invariants: [
        'Mutable tag là lookup convenience, không phải immutable release identity.',
        'Promotion phải giữ nguyên artifact byte; environment config đổi ngoài image.',
        'Scanner finding cần triage theo package presence, runtime reachability, fix availability và policy.',
        'Runtime hardening là defense in depth, không bỏ nhu cầu patch app và kernel vulnerability.',
      ],
      walkthrough: `Final image dùng pinned version base, non-root user, healthcheck và artifact copy hẹp. Compose minh họa deployment-like contract với image reference, read-only root, temporary writable space, drop capability, không privilege escalation, resource control và local-only publishing. Thay tag minh họa bằng organization registry và deploy theo digest trong release pipeline thật.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY . .
RUN npm test && npm run build

FROM node:22.12.0-alpine3.21
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
ENV NODE_ENV=production
USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  api:
    image: registry.example.com/team/api:1.8.0
    ports: ["127.0.0.1:3000:3000"]
    read_only: true
    tmpfs:
      - /tmp:size=32m,mode=1777
    cap_drop: [ALL]
    security_opt:
      - no-new-privileges:true
    pids_limit: 128
    mem_limit: 256m
`,
      steps: [
        'Build với source revision và version label, tag image bằng unique release version rồi capture local digest.',
        'Authenticate vào test registry bằng credential input không xuất hiện trên command line hay shell history.',
        'Push một lần, inspect remote manifest và ghi immutable digest registry trả về.',
        'Pull và run bằng digest trong clean environment, chứng minh application/health contract.',
        'Generate SBOM và scan image; triage finding theo runtime content thật và fix có sẵn.',
        'Thử write, privilege gain và disallowed operation dưới hardened Compose; document exception thay vì bỏ mọi control.',
      ],
      review: `Production checklist cần evidence-driven. Ghi builder identity, source revision, dependency lock, base digest, image digest, test result, SBOM, scan result, signature/attestation và approver policy. Bảo vệ deletion và tag mutation trong registry. Định retention mà không xóa artifact còn cần rollback hay investigation. Rebuild dù source không đổi khi có patched base/dependency, tạo digest mới và lặp validation.`,
      pitfalls: [
        'Deploy cùng moving tag qua môi trường làm observed difference không thể attribute chắc chắn.',
        'Pin digest mãi không có update process đổi surprise upgrade lấy vulnerability stagnation âm thầm.',
        'Xem mọi scanner finding exploitable như nhau tạo alert fatigue; bỏ finding chưa fix tạo unmanaged risk.',
        'Chạy numeric non-root user nhưng cấp broad capability hoặc host mount vẫn có powerful access.',
        'Dùng long-lived shared registry credential trên developer machine và CI ngăn attribution, tăng blast radius.',
      ],
      tradeoff: `Digest pinning cho immutable identity nhưng cần automation báo update. Version tag giúp người đọc nhưng cần immutability policy. Distroless image giảm shell và package manager surface nhưng có thể làm certificate, native dependency và incident inspection khó; ephemeral debug container có thể tốt hơn. Signing chỉ cải thiện provenance decision khi verifier enforce trusted identity và policy. Mỗi control cần owner và failure mode, không chỉ checkbox.`,
      exercises: [
        {
          name: 'Promotion record',
          task: 'Build một lần và promote cùng digest qua record development, staging, production giả với runtime config khác.',
          done: 'Cho digest giống, config khác, release metadata và rollback về digest trước.',
        },
        {
          name: 'Threat model đường đi',
          task: 'Map trust boundary từ developer context qua CI, registry, deployment identity, runtime và host.',
          done: 'Mỗi boundary có credential, write authority, tampering signal, preventive control và recovery action.',
        },
        {
          name: 'Harden và biện minh',
          task: 'Áp dụng non-root, read-only root, tmpfs, capability drop, no-new-privileges, limit và narrow mount.',
          done: 'Chạy functional check và document mỗi exception với exact operation cần nó.',
        },
      ],
    },
  }),
  makeSection({
    id: 'docker-capstone',
    en: {
      title: 'Capstone: ship a small stack',
      baseline: [
        'Completed or can apply the previous Docker sections',
        'Can build a small HTTP service with a database-backed operation',
        'Can write concise operational documentation and acceptance checks',
      ],
      skills: [
        'Integrate build, runtime, persistence, networking, configuration, health, and security decisions',
        'Produce and validate an immutable release artifact and local stack contract',
        'Demonstrate cold start, migration, backup, restore, failure diagnosis, and rollback',
      ],
      why: `Docker knowledge becomes useful when the separate controls form one coherent delivery path. A fast multi-stage build is not enough if the stack stores data in a disposable layer. A persistent database is not enough if migrations race startup. A healthcheck is not enough if the process ignores termination. A signed digest is not enough if runtime configuration leaks credentials. The capstone asks you to make these boundaries agree and to prove them with evidence.

The deliverable is a small API plus PostgreSQL, not a miniature platform. It should be understandable in one review: source produces one image; Compose supplies local infrastructure and runtime settings; a migration job owns schema transition; the database owns durable records; health and logs expose status; and a release record identifies the tested image. Scope discipline matters. Add only components that establish a required property.`,
      decision: `Choose a minimal API with three operations: health, create an item, and list items. Use one schema migration. Build one runtime image that can execute either the server or migration command. Keep PostgreSQL on an internal network and publish only the API to loopback. Inject the database password as a secret file. Use a named volume and logical backup. Set resource and privilege controls that the service can pass. Tag the release but record its digest.`,
      model: `The stack has four lifecycles. The image lifecycle starts at locked source, passes tests and multi-stage build, and ends at an immutable digest. The application lifecycle starts after a successful finite migration, becomes ready when it can serve, drains on termination, and emits logs to standard output. The data lifecycle begins with volume initialization, continues through schema migration, and includes backup, restore, and retirement. The configuration lifecycle supplies non-secret settings and secret files without changing image bytes.

Acceptance should follow those lifecycles. A cold build proves context and dependency declarations. A clean start proves orchestration. An API check proves networking and service behavior. Container recreation proves persistence. Restore into a separate volume proves recovery. Limit and health experiments prove observability. Running by recorded digest proves artifact identity. Teardown proves cleanup does not accidentally erase retained data.`,
      invariants: [
        'The same application digest is used for migration and API runtime.',
        'Only the API is host-published; database communication uses service DNS and container port.',
        'Database records survive application and database container replacement.',
        'No real secret enters source, context, layer, image metadata, or shared logs.',
        'A clean operator can execute build, start, verify, backup, restore, rollback, and teardown from documentation.',
      ],
      walkthrough: `This reference shape uses a Node builder and non-root runtime, a finite migration service, PostgreSQL health gating, secret files, backend network, volume, healthcheck, and runtime hardening. The source files are intentionally omitted from the course snippet so the exercise remains yours; the Docker contract names the required \`dist/server.js\` and \`dist/migrate.js\` outputs. The Compose model is small enough to inspect and complete enough to exercise every major boundary.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm test && npm run build

FROM node:22.12.0-alpine3.21 AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
  CMD wget -q -T 1 -O /dev/null http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    volumes: [db-data:/var/lib/postgresql/data]
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 3s
      timeout: 2s
      retries: 20
  migrate:
    build:
      context: .
      target: runtime
    command: ["node", "dist/migrate.js"]
    environment:
      DATABASE_HOST: db
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    networks: [backend]
    depends_on:
      db:
        condition: service_healthy
  api:
    build:
      context: .
      target: runtime
    environment:
      DATABASE_HOST: db
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    networks: [backend]
    ports: ["127.0.0.1:3000:3000"]
    depends_on:
      migrate:
        condition: service_completed_successfully
    read_only: true
    tmpfs: ["/tmp:size=32m"]
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    mem_limit: 256m
    pids_limit: 128
secrets:
  db-password:
    file: ./secrets/db-password.txt
volumes:
  db-data:
networks:
  backend:
    internal: true
`,
      steps: [
        'Create the source, lockfile, tests, `.dockerignore`, ignored local secret, example configuration, Dockerfile, Compose file, and operator README.',
        'Run a clean multi-stage build, inspect the context and cache boundaries, then record image size, user, command, labels, and digest.',
        'Render Compose config, cold-start the stack, observe database health and migration completion, then exercise create and list operations.',
        'Recreate API and database containers without deleting the volume; prove the same records remain and health recovers.',
        'Produce a logical backup, restore into an independent project and volume, then run schema and API checks against the restored stack.',
        'Run security and resource checks, push an immutable release to a test registry, run by digest, and rehearse rollback to the prior digest.',
      ],
      review: `The final review should be reproducible evidence, not screenshots alone. Include exact commands and expected signals. Verify a second engineer can start from a clean checkout without relying on global Node packages or a host database. Inspect the final image for source, development dependencies, credentials, and ownership. Explain every published port, mount, writable path, capability, health dependency, and persistent object. Document destructive commands conspicuously and separate routine teardown from data deletion.`,
      pitfalls: [
        'Adding a proxy, queue, cache, dashboard, and orchestrator without a requirement dilutes the delivery evidence and creates unrelated failure modes.',
        'Running migrations automatically in every API replica creates races and unclear schema ownership.',
        'Using a bind-mounted source tree for final acceptance bypasses the image artifact being shipped.',
        'Claiming persistence after only restarting a container does not prove replacement or restore behavior.',
        'Recording a tag without its digest leaves the tested and deployed bytes ambiguous.',
        'Writing a README that says “run Docker” without exact inputs, checks, backup, and cleanup leaves the operational contract incomplete.',
      ],
      tradeoff: `The capstone intentionally favors one repository and Compose stack so boundaries stay visible. A real production system may replace PostgreSQL with a managed service, Compose with a scheduler, local secret files with workload identity, and manual promotion with policy-driven CI. Those changes should preserve the contracts proven here. Do not copy local implementation details blindly; carry forward immutable artifacts, explicit configuration, least privilege, health semantics, recoverable data, and evidence-based release identity.`,
      exercises: [
        {
          name: 'Ship the reference stack',
          task: 'Implement the three API operations, migration, tests, Dockerfile, Compose model, and concise runbook described above.',
          done: 'A clean checkout passes build, cold start, health, create/list, replacement, teardown, and no-secret checks.',
        },
        {
          name: 'Recovery and rollback',
          task: 'Back up data, deploy a deliberately incompatible application version, detect failure, roll back by digest, and restore into a separate stack.',
          done: 'Provide timestamps, commands, preserved records, resolved digest, and the root-cause explanation.',
        },
        {
          name: 'Peer operational review',
          task: 'Have a peer follow only the runbook and record every ambiguity or machine-specific assumption.',
          done: 'Revise the runbook, then repeat from a clean project until all acceptance evidence is reproducible.',
        },
      ],
    },
    vn: {
      title: 'Capstone: ship một stack nhỏ',
      baseline: [
        'Đã hoàn thành hoặc áp dụng được các phần Docker trước',
        'Build được HTTP service nhỏ có operation dùng database',
        'Viết được operational documentation và acceptance check ngắn gọn',
      ],
      skills: [
        'Tích hợp quyết định build, runtime, persistence, networking, configuration, health và security',
        'Tạo và validate immutable release artifact cùng local stack contract',
        'Chứng minh cold start, migration, backup, restore, failure diagnosis và rollback',
      ],
      why: `Kiến thức Docker hữu ích khi các control riêng tạo một delivery path nhất quán. Multi-stage build nhanh chưa đủ nếu stack lưu data trong disposable layer. Database persistent chưa đủ nếu migration race startup. Healthcheck chưa đủ nếu process bỏ qua termination. Signed digest chưa đủ nếu runtime config leak credential. Capstone yêu cầu các boundary đồng thuận và được chứng minh bằng evidence.

Deliverable là API nhỏ cộng PostgreSQL, không phải platform thu nhỏ. Nó cần hiểu được trong một review: source tạo một image; Compose cung cấp local infrastructure và runtime setting; migration job sở hữu schema transition; database sở hữu durable record; health/log lộ status; release record định danh tested image. Kỷ luật scope quan trọng. Chỉ thêm component để thiết lập property bắt buộc.`,
      decision: `Chọn API tối giản với ba operation: health, create item, list item. Dùng một schema migration. Build một runtime image chạy được server hoặc migration command. Giữ PostgreSQL trên internal network và chỉ publish API vào loopback. Inject database password bằng secret file. Dùng named volume và logical backup. Đặt resource/privilege control mà service vượt qua. Tag release nhưng ghi digest.`,
      model: `Stack có bốn lifecycle. Image lifecycle bắt đầu ở locked source, qua test và multi-stage build, kết thúc ở immutable digest. Application lifecycle bắt đầu sau finite migration thành công, ready khi phục vụ được, drain lúc termination và emit log ra standard output. Data lifecycle bắt đầu với volume initialization, tiếp tục qua schema migration và gồm backup, restore, retirement. Configuration lifecycle cấp non-secret setting và secret file mà không đổi image byte.

Acceptance đi theo lifecycle đó. Cold build chứng minh context/dependency declaration. Clean start chứng minh orchestration. API check chứng minh networking/service behavior. Container recreation chứng minh persistence. Restore sang volume riêng chứng minh recovery. Limit/health experiment chứng minh observability. Run bằng recorded digest chứng minh artifact identity. Teardown chứng minh cleanup không vô tình xóa retained data.`,
      invariants: [
        'Cùng application digest được dùng cho migration và API runtime.',
        'Chỉ API host-published; database communication dùng service DNS và container port.',
        'Database record sống qua replacement application và database container.',
        'Không real secret nào vào source, context, layer, image metadata hoặc shared log.',
        'Operator sạch chạy được build, start, verify, backup, restore, rollback và teardown từ documentation.',
      ],
      walkthrough: `Reference shape dùng Node builder và non-root runtime, finite migration service, PostgreSQL health gating, secret file, backend network, volume, healthcheck và runtime hardening. Source file được cố ý bỏ khỏi course snippet để exercise vẫn là của bạn; Docker contract gọi output \`dist/server.js\` và \`dist/migrate.js\` bắt buộc. Compose model đủ nhỏ để inspect và đủ hoàn chỉnh để kiểm tra mọi boundary chính.`,
      dockerfile: String.raw`
# syntax=docker/dockerfile:1.7
FROM node:22.12.0-alpine3.21 AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm test && npm run build

FROM node:22.12.0-alpine3.21 AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --omit=dev
COPY --from=build --chown=node:node /src/dist ./dist
ENV NODE_ENV=production PORT=3000
USER node
EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=2s --retries=3 \
  CMD wget -q -T 1 -O /dev/null http://127.0.0.1:3000/health || exit 1
CMD ["node", "dist/server.js"]
`,
      compose: String.raw`
services:
  db:
    image: postgres:17.2-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    volumes: [db-data:/var/lib/postgresql/data]
    networks: [backend]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app -d app"]
      interval: 3s
      timeout: 2s
      retries: 20
  migrate:
    build:
      context: .
      target: runtime
    command: ["node", "dist/migrate.js"]
    environment:
      DATABASE_HOST: db
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    networks: [backend]
    depends_on:
      db:
        condition: service_healthy
  api:
    build:
      context: .
      target: runtime
    environment:
      DATABASE_HOST: db
      DATABASE_PASSWORD_FILE: /run/secrets/db-password
    secrets: [db-password]
    networks: [backend]
    ports: ["127.0.0.1:3000:3000"]
    depends_on:
      migrate:
        condition: service_completed_successfully
    read_only: true
    tmpfs: ["/tmp:size=32m"]
    cap_drop: [ALL]
    security_opt: ["no-new-privileges:true"]
    mem_limit: 256m
    pids_limit: 128
secrets:
  db-password:
    file: ./secrets/db-password.txt
volumes:
  db-data:
networks:
  backend:
    internal: true
`,
      steps: [
        'Tạo source, lockfile, test, `.dockerignore`, ignored local secret, example config, Dockerfile, Compose file và operator README.',
        'Chạy clean multi-stage build, inspect context/cache boundary, ghi image size, user, command, label và digest.',
        'Render Compose config, cold-start stack, quan sát database health/migration completion rồi exercise create/list.',
        'Recreate API và database container không xóa volume; chứng minh cùng record còn và health phục hồi.',
        'Tạo logical backup, restore vào independent project/volume rồi chạy schema/API check trên restored stack.',
        'Chạy security/resource check, push immutable release lên test registry, run by digest và diễn tập rollback digest trước.',
      ],
      review: `Final review cần reproducible evidence, không chỉ screenshot. Có exact command và expected signal. Xác minh kỹ sư thứ hai start từ clean checkout không dựa global Node package hay host database. Inspect final image tìm source, development dependency, credential và ownership. Giải thích mọi published port, mount, writable path, capability, health dependency và persistent object. Document destructive command nổi bật, tách routine teardown khỏi data deletion.`,
      pitfalls: [
        'Thêm proxy, queue, cache, dashboard và orchestrator khi không có requirement làm loãng delivery evidence, tạo failure mode ngoài scope.',
        'Chạy migration tự động trong mọi API replica tạo race và schema ownership mơ hồ.',
        'Dùng bind-mounted source tree cho final acceptance bỏ qua image artifact sẽ ship.',
        'Claim persistence sau khi chỉ restart container không chứng minh replacement hay restore.',
        'Ghi tag mà không có digest làm byte tested và deployed mơ hồ.',
        'README chỉ nói “run Docker” mà thiếu exact input, check, backup, cleanup làm operational contract chưa hoàn chỉnh.',
      ],
      tradeoff: `Capstone cố ý ưu tiên một repository và Compose stack để boundary rõ. Production thật có thể thay PostgreSQL bằng managed service, Compose bằng scheduler, local secret file bằng workload identity và manual promotion bằng policy-driven CI. Các thay đổi đó cần giữ contract đã chứng minh. Không copy local implementation detail mù quáng; mang theo immutable artifact, explicit config, least privilege, health semantics, recoverable data và evidence-based release identity.`,
      exercises: [
        {
          name: 'Ship reference stack',
          task: 'Implement ba API operation, migration, test, Dockerfile, Compose model và runbook ngắn như mô tả.',
          done: 'Clean checkout qua build, cold start, health, create/list, replacement, teardown và no-secret check.',
        },
        {
          name: 'Recovery và rollback',
          task: 'Backup data, deploy application version cố ý incompatible, detect failure, rollback bằng digest và restore vào stack riêng.',
          done: 'Có timestamp, command, preserved record, resolved digest và root-cause explanation.',
        },
        {
          name: 'Peer operational review',
          task: 'Cho peer chỉ theo runbook và ghi mọi ambiguity hoặc machine-specific assumption.',
          done: 'Sửa runbook rồi lặp từ clean project tới khi mọi acceptance evidence reproducible.',
        },
      ],
    },
  }),
];

/** @type {import('../catalog.js').Course} */
export const docker = {
  id: 'docker',
  title: { en: 'Docker', vn: 'Docker' },
  summary: {
    en: 'Build, run, secure, and ship repeatable containerized services from first principles through a production-minded capstone.',
    vn: 'Build, chạy, bảo mật và ship dịch vụ container có thể lặp lại, từ nguyên lý nền tảng đến capstone hướng production.',
  },
  sections,
};
