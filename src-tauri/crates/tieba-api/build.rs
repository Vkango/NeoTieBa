use std::{fs, path::{Path, PathBuf}};

fn main() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("proto");
    println!("cargo:rerun-if-changed={}", root.display());
    let out = PathBuf::from(std::env::var_os("OUT_DIR").unwrap()).join("proto");
    fs::create_dir_all(&out).unwrap();
    copy(&root, &out);
    for (module, dir) in [("thread_page", "PbPage"), ("bar_page", "FrsPage"), ("floor", "PbFloor"), ("profile", "Profile"), ("user_post", "UserPost")] {
        let output = out.join(module); fs::create_dir_all(&output).unwrap();
        let mut config = prost_build::Config::new(); config.out_dir(&output);
        config.type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]");
        config.type_attribute(".", "#[serde(default)]");
        config.compile_protos(&[out.join(dir).join(format!("{dir}ReqIdl.proto")), out.join(dir).join(format!("{dir}ResIdl.proto"))], &[out.clone()]).unwrap();
    }
}

fn copy(src: &Path, dst: &Path) {
    for entry in fs::read_dir(src).unwrap() {
        let entry = entry.unwrap(); let path = entry.path(); let target = dst.join(entry.file_name());
        if path.is_dir() { fs::create_dir_all(&target).unwrap(); copy(&path, &target); }
        else if path.extension().and_then(|x| x.to_str()) == Some("proto") {
            let mut text = fs::read_to_string(&path).unwrap();
            if path.file_name().and_then(|x| x.to_str()) == Some("VideoActive.proto") {
                text = text.lines().filter(|line| !line.contains("import \"ThreadInfo.proto\";") && !line.contains("repeated ThreadInfo thread_list = 8;")).collect::<Vec<_>>().join("\n");
            }
            fs::write(target, text).unwrap();
        }
    }
}
