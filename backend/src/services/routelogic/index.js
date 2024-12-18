import { LecturerModel } from '../../schemas/lecturers.schema.js';
import { userModel } from '../../schemas/user.schema.js';
import { ResourceModel } from '../../schemas/resources.schema.js';
import { AssignmentModel } from '../../schemas/assignments.schema.js';
import { NotificationModel } from '../../schemas/notifications.schema.js';
import { SubmissionModel } from '../../schemas/submissions.schema.js';
import multer from 'multer';
import archiver from 'archiver';
import path from 'path';
const upload = multer({ dest: './uploads/' });

// Lecturer APIs
export const postLecturerUploadResourceRouteHandler = async (req, res) => {
  upload.single('resourceContent')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error uploading resource' });
    } else {
      try {
        const lecturerId = req.params.lecturerId;
        const resource = new ResourceModel({
          resourceName: req.body.resourceName,
          resourceType: req.body.resourceType,
          courseunit: req.body.courseunit,
          course: req.body.course,
          lecturer: lecturerId,
          resourceContent: req.file.path,        });
        await resource.save();
        res.json({ message: 'Resource uploaded successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
};

export const postLecturerSetAssignmentRouteHandler = async (req, res) => {
  upload.single('assignmentFile')(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Error setting assignment' });
    } else {
      try {
        const lecturerId = req.params.lecturerId;
        const assignment = new AssignmentModel({
          assignmentName: req.body.assignmentName,
          deadlineDate: req.body.deadlineDate,
          deadlineTime: req.body.deadlineTime,
          Type: req.body.type,
          course: req.body.course,
          lecturer: lecturerId,
          assignment: req.file.path,
        });
        await assignment.save();
        res.json({ message: 'Assignment set successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    }
  });
};

export const getLecturerAssignmentsRouteHandler = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;
    const assignments = await AssignmentModel.find({ lecturer: lecturerId });
    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLecturerAssignmentSubmissionsRouteHandler = async (req, res) => {
  try {
    const assignmentId = req.body.assignmentId;
    const submissions = await SubmissionModel.find({ assignment: assignmentId });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLecturerResourcesRouteHandler = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;
    const resources = await ResourceModel.find({ lecturer: lecturerId });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const patchLecturerEditResourceRouteHandler = async (req, res) => {
  try {
    const resourceId = req.body.resourceId;
    const resource = await ResourceModel.findByIdAndUpdate(resourceId, req.body, { new: true });
    res.json(resource);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteLecturerDeleteResourceRouteHandler = async (req, res) => {
  try {
    const resourceId = req.body.resourceId;
    await ResourceModel.findByIdAndDelete(resourceId);
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Student APIs
export const getStudentCourseResourcesRouteHandler = async (req, res) => {
  try {
    const course = req.params.course;
    const resources = await ResourceModel.find({ course: course });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getStudentCourseUnitResourcesRouteHandler = async (req, res) => {
  try {
    const courseunit = req.body.courseunit;
    const resources = await ResourceModel.find({ courseunit: courseunit });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const getStudentResourcesByTypeRouteHandler = async (req, res) => {
  try {
    const resourcetype = req.params.type;
    const resources = await ResourceModel.find({ resourceType: resourcetype });
    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

  
  export const postStudentSubmitAssignmentRouteHandler = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting assignment' });
      } else {
        try {
          const assignmentId = req.body.assignmentId;
          const studentId = req.body.studentId;
          const submission = new SubmissionModel({
            assignment: assignmentId,
            userId: studentId,
            file: req.file.filename,
            submittedAt: Date.now(),
            ...req.body,
          });
          await submission.save();
          res.json({ message: 'Assignment submitted successfully' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Server error' });
        }
      }
    });
  };
  
  
  export const getStudentAssignmentSubmissionsRouteHandler = async (req, res) => {
    try {
      const studentId = req.body.studentId;
      const submissions = await SubmissionModel.find({ student: studentId });
      res.json(submissions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const getStudentGroupMembersRouteHandler = async (req, res) => {
    try {
      const groupname = req.params.groupname;
      const members = await userModel.find({groupname: groupname});
      res.json(members);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const getStudentNotificationsRouteHandler = async (req, res) => {
    try {
      const studentId = req.params.studentId;
      const notifications = await NotificationModel.find({ student: studentId });
      res.json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const postStudentNotificationsRouteHandler = async (req, res) => {
    try {
      
      const { studentId, title, message } = req.body;
  
      await NotificationModel.create({
        userId: studentId,
        title,
        message,
      });
  
      res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const updateStudentNotificationsRouteHandler = async (req, res) => {
    try {
      const studentId = req.params.studentId;
  
      // Validate studentId
      if (!studentId) {
        return res.status(400).json({ message: 'Student ID is required' });
      }
  
      // Update notifications
      const updateResult = await NotificationModel.updateMany(
        { userId: studentId, read: false },
        { $set: { read: true } }
      );
  
      // Check if any notifications were updated
      if (updateResult.modifiedCount === 0) {
        return res.status(404).json({ message: 'No notifications found for the student' });
      }
  
      res.status(200).json({ message: 'Notifications marked as read successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  
  export const postGroupSubmitGroupAssignmentRouteHandler = async (req, res) => {
    try {
      const assignmentId = req.body.assignmentId;
      const userId = req.body.studentId;
      const submission = new SubmissionModel({ assignment: assignmentId, userId: userId, ...req.body });
      await submission.save();
      res.json({ message: 'Group assignment submitted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

  export const getAdminUsersRouteHandler = async (req, res) => {
    try {
      const users = await userModel.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getAdminLecturersRouteHandler = async (req, res) => {
    try {
      const users = await LecturerModel.find();
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const getAdminUserRouteHandler = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findById(userId);
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const patchAdminEditUserRouteHandler = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await userModel.findByIdAndUpdate(userId, req.body, { new: true });
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const deleteAdminDeleteUserRouteHandler = async (req, res) => {
    try {
      const userId = req.params.userId;
      await userModel.findByIdAndDelete(userId);
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const getAdminLecturerRouteHandler = async (req, res) => {
    try {
      const lecturerId = req.params.lecturerId;
      const lecturer = await LecturerModel.findById(lecturerId);
      res.json(lecturer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const patchAdminEditLecturerRouteHandler = async (req, res) => {
    try {
      const lecturerId = req.params.lecturerId;
      const lecturer = await LecturerModel.findByIdAndUpdate(lecturerId, req.body, { new: true });
      res.json(lecturer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const deleteAdminDeleteLecturerRouteHandler = async (req, res) => {
    try {
      const lecturerId = req.params.lecturerId;
      await LecturerModel.findByIdAndDelete(lecturerId);
      res.json({ message: 'Lecturer deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  // Assignment APIs
export const getAssignmentsRouteHandler = async (req, res) => {
    try {
    const course = req.params.course;
    const assignments = await AssignmentModel.find({course: course});
    res.json(assignments);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    export const getAssignmentRouteHandler = async (req, res) => {
    try {
    const assignmentId = req.body.assignmentId;
    const assignment = await AssignmentModel.findById(assignmentId);
    res.json(assignment);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    
    };
    
    export const postAssignmentSubmitRouteHandler = async (req, res) => {
    try {
    const assignmentId = req.body.assignmentId;
    const submission = new SubmissionModel({ assignment: assignmentId, ...req.body });
    await submission.save();
    res.json({ message: 'Assignment submitted successfully' });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // Resource APIs
    export const getResourcesRouteHandler = async (req, res) => {
    try {
    const resources = await ResourceModel.find();
    res.json(resources);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    export const getResourceRouteHandler = async (req, res) => {
    try {
    const resourceId = req.body.resourceId;
    const resource = await ResourceModel.findById(resourceId);
    res.json(resource);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // Submission APIs
    export const getSubmissionsRouteHandler = async (req, res) => {
    try {
    const submissions = await SubmissionModel.find();
    res.json(submissions);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    export const getSubmissionRouteHandler = async (req, res) => {
    try {
    const submissionId = req.body.submissionId;
    const submission = await SubmissionModel.findById(submissionId);
    res.json(submission);
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    }
    };
    
    // Profile APIs
export const getStudentProfileRouteHandler = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const student = await userModel.findById(studentId);
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLecturerProfileRouteHandler = async (req, res) => {
  try {
    const lecturerId = req.params.lecturerId;
    const lecturer = await LecturerModel.findById(lecturerId);
    res.json(lecturer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
    export const postLecturerDownloadAllSubmissionsRouteHandler = async (req, res) => {
      try {
        const assignmentId = req.body.assignmentId;
        const submissions = await SubmissionModel.find({ assignment: assignmentId });
    
        const archive = archiver('zip', {
          zlib: { level: 9 } 
        });
    
        res.attachment(`assignment-${assignmentId}-submissions.zip`);
    
        archive.pipe(res);
    
        submissions.forEach(submission => {
          archive.file(submission.file.path, { name: `${submission.studentId}-${submission.fileName}` });
        });
    
        archive.finalize();
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
    };