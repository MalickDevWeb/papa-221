import { readDb, writeDb } from "../db";

export function updateDbCollection(key: string, item: any) {
  const db = readDb() as any;
  db[key] = db[key] || [];
  db[key].push(item);
  writeDb(db);
  return item;
}

export function createBalancedGroups(name: string, classId: string, criteria: string, numGroups: number) {
  const db = readDb() as any;
  const promoStudents = (db.students || []).filter((s: any) => s.promotion_id === classId);
  const sorted = [...promoStudents];
  
  if (criteria === "gpa") {
    sorted.sort((a, b) => b.gpa - a.gpa);
  } else if (criteria === "average") {
    sorted.sort((a, b) => b.average - a.average);
  } else if (criteria === "gender") {
    sorted.sort((a, b) => (a.gender || "M").localeCompare(b.gender || "M"));
  } else if (criteria === "random") {
    sorted.sort(() => Math.random() - 0.5);
  }

  const groupsCount = numGroups || 2;
  const newGroups = Array.from({ length: groupsCount }, (_, i) => ({
    id: `group-${Date.now()}-${i}`,
    name: `${name} ${i + 1}`,
    description: `Groupe équilibré automatiquement par critère : ${criteria}`,
    creationDate: new Date().toLocaleDateString("fr-FR"),
    classId,
    members: [] as any[],
    projects: [],
    leaderId: "",
    leaderName: ""
  }));

  sorted.forEach((student, idx) => {
    const groupIdx = idx % groupsCount;
    newGroups[groupIdx].members.push({
      id: student.id,
      name: student.name,
      email: `${student.name.toLowerCase().replace(/\s+/g, ".")}@ecole221.sn`,
      gpa: student.gpa,
      gender: student.gender || "M"
    });
  });

  newGroups.forEach(g => {
    if (g.members.length > 0) {
      g.leaderId = g.members[0].id;
      g.leaderName = g.members[0].name;
    }
  });

  db.workgroups = db.workgroups || [];
  db.workgroups.push(...newGroups);
  writeDb(db);
  return newGroups;
}

export function handleDocumentUpload(groupId: string, name: string, description: string, author: string) {
  const db = readDb() as any;
  db.collabDocuments = db.collabDocuments || [];
  const existing = db.collabDocuments.find((d: any) => d.groupId === groupId && d.name === name);
  
  if (existing) {
    existing.latestVersion += 1;
    existing.updatedBy = author;
    existing.updatedAt = new Date().toLocaleString("fr-FR");
    existing.history.push({
      version: existing.latestVersion,
      author,
      fileUrl: "#",
      updatedAt: existing.updatedAt,
      comment: description || `Mise à jour v${existing.latestVersion}`
    });
    writeDb(db);
    return existing;
  }

  const newDoc = {
    id: `doc-${Date.now()}`,
    groupId,
    name,
    description,
    latestVersion: 1,
    updatedBy: author,
    updatedAt: new Date().toLocaleString("fr-FR"),
    history: [{ version: 1, author, fileUrl: "#", updatedAt: new Date().toLocaleString("fr-FR"), comment: "Création initiale" }],
    status: "En attente",
    comments: []
  };
  db.collabDocuments.push(newDoc);
  writeDb(db);
  return newDoc;
}
